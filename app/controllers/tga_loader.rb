=begin


typedef struct
{
  GLsizei width;
  GLsizei height;

  GLenum format;
  GLint	internalFormat;
  GLuint id;

  GLubyte *texels;

} gl_texture_t;


#pragma pack(push, 1)
/* tga header */
typedef struct
{
  GLubyte id_lenght;          /* size of image id */
  GLubyte colormap_type;      /* 1 is has a colormap */
  GLubyte image_type;         /* compression type */

  short	cm_first_entry;       /* colormap origin */
  short	cm_length;            /* colormap length */
  GLubyte cm_size;            /* colormap size */

  short	x_origin;             /* bottom left x coord origin */
  short	y_origin;             /* bottom left y coord origin */

  short	width;                /* picture width (in pixels) */
  short	height;               /* picture height (in pixels) */

  GLubyte pixel_depth;        /* bits per pixel: 8, 16, 24 or 32 */
  GLubyte image_descriptor;   /* 24 bits = 0x00; 32 bits = 0x80 */

} tga_header_t;

=end
require 'stringio'
require 'chunky_png'

#require_relative 'tga_loader'

class TgaLoader
	
	def initialize
		@header={:upak=>"CCCssCssssCC",:size=>18}
		@texinfo={:data=>[]}
	end
	
	def readTga (str)
		data=StringIO.new str
		#get texinfo
		header=data.read(@header[:size]).unpack(@header[:upak])
		@texinfo[:width]=header[8]
		@texinfo[:height]=header[9]
		case header[2]
			when 3,11 			#3: grayscale 8 bits; 11: grayscale 8 bits (RLE) 
				if (header[10]==8)
					@texinfo[:format] = :LUMINANCE
					@texinfo[:internalFormat] = 1
				else
					@texinfo[:format] = :LUMINANCE_ALPHA
					@texinfo[:internalFormat] = 2
				end
			when 1,2,9,10			# 1: 8 bits color index; 2: BGR 16-24-32 bits; 9: 8 bits color index (RLE); 10: BGR 16-24-32 bits (RLE)
				if (header[10] <= 24)
					@texinfo[:format] = :RGB
					@texinfo[:internalFormat] = 3
				else # 32 bits 
					@texinfo[:format] = :RGBA
					@texinfo[:internalFormat] = 4
				end
		end
		#	
		data.read(header[0])
		colormap=[]
		if (header[1]!=0)
			upak=""
			header[4]*(header[4]>>3).times{upak+="C"}
			colormap=data.read(header[4]*(header[4]>>3)).unpack(upak)
		end
		case header[2]
			when 0		#no data
			
			when 1		#uncompressed 8 bits color index
				read8Bits(data, colormap)
			
			when 2		#uncompressed 16-24-32 bits
				case header[10]
					when 16
						read16Bits(data)
					when 24
						read24Bits(data)
					when 32
						read32Bits(data)
				end
			when 3		#uncompressed 16-24-32 bits
				if  (header[10]==8)
					readGray8Bits(data)
				else
					readGray16Bits(data)
				end
			when 9		#RLE compressed 8 bits color index
				read8bitsRLE(data, colormap);
			when 10
				case header[10]
					when 16
						read16BitsRLE(data)
					when 24
						read24BitsRLE(data)
					when 32
						read32BitsRLE(data)
				end
			when 11		#RLE compressed 8 or 16 bits grayscale
				if  (header[10]==8)
					readGray8BitsRLE(data)
				else
					readGray16BitsRLE(data)
				end
			else			#not correct
				puts "Not correct file"
			end
		
	end
	
	def read8Bits(data, colormap)
		(@texinfo[:width]*@texinfo[:height]).times do |i|
			color=data.read(1).unpack("C")[0]
			@texinfo[:data][i]={:a=>255}
			#BRG to RGB  TODO: check
			@texinfo[:data][i][:r]=colormap[i*3+2]
			@texinfo[:data][i][:g]=colormap[i*3+1]
			@texinfo[:data][i][:b]=colormap[i*3+0]
		end
	end
	
	def read16Bits(data)
		(@texinfo[:width]*@texinfo[:height]).times do |i|
			color=data.read(1).unpack("C")[0] + (data.read(1).unpack("C")[0] << 8)
			@texinfo[:data][i]={:a=>255}
			#BRG to RGB  TODO: check
			@texinfo[:data][i][:r]=(((color & 0x7C00) >> 10) << 3)
			@texinfo[:data][i][:g]=(((color & 0x03E0) >>  5) << 3)
			@texinfo[:data][i][:b]=(((color & 0x001F) >>  0) << 3)
		end
	end
	
	def read24Bits(data)
		(@texinfo[:width]*@texinfo[:height]).times do |i|
			@texinfo[:data][i]={:a=>255}
			#BRG to RGB  TODO: check
			@texinfo[:data][i][:b]=data.read(1).unpack("C")[0]
			@texinfo[:data][i][:g]=data.read(1).unpack("C")[0]
			@texinfo[:data][i][:r]=data.read(1).unpack("C")[0]
		end
	end
	
	def read32Bits(data)
		(@texinfo[:width]*@texinfo[:height]).times do |i|
			@texinfo[:data][i]={}
			#BGRA to RGBA   TODO: check
			@texinfo[:data][i][:b]=data.read(1).unpack("C")[0]
			@texinfo[:data][i][:g]=data.read(1).unpack("C")[0]
			@texinfo[:data][i][:r]=data.read(1).unpack("C")[0]
			@texinfo[:data][i][:a]=data.read(1).unpack("C")[0]
		end
	end
	
	def readGray8Bits(data)
		(@texinfo[:width]*@texinfo[:height]).times do |i|
			@texinfo[:data][i]={:a=>255}
			#Grey scale   TODO: check
			@texinfo[:data][i][:r]=data.read(1).unpack("C")[0]
			@texinfo[:data][i][:g]=@texinfo[:data][i][:r]
			@texinfo[:data][i][:b]=@texinfo[:data][i][:r]
		end
	end
	
	def readGray16Bits(data)
		(@texinfo[:width]*@texinfo[:height]).times do |i|
			@texinfo[:data][i]={}
			#Grey scale + alpha   TODO: check
			@texinfo[:data][i][:r]=data.read(1).unpack("C")[0]
			@texinfo[:data][i][:g]=@texinfo[:data][i][:r]
			@texinfo[:data][i][:b]=@texinfo[:data][i][:r]
			@texinfo[:data][i][:a]=data.read(1).unpack("C")[0]
		end
	end
	
	def read8BitsRLE(data)
		i=0
		while(i<(@texinfo[:width]*@texinfo[:height])) do
			# read first byte
			packet_header=data.read(1).unpack("C")[0]
			size=1+(packet_header & 0x7f)
			
			if ((packet_header & 0x80)!=0)
				# run-length packet
				color = color=data.read(1).unpack("C")[0]
				size.times do 
					@texinfo[:data][i]={:a=>255}
					@texinfo[:data][i][:r]=colormap[i*3+2]
					@texinfo[:data][i][:g]=colormap[i*3+1]
					@texinfo[:data][i][:b]=colormap[i*3+0]
					i+=1
				end
			else
				# non run-length packet
				size.times do
					color = color=data.read(1).unpack("C")[0]
					@texinfo[:data][i]={:a=>255}
					@texinfo[:data][i][:r]=colormap[i*3+2]
					@texinfo[:data][i][:g]=colormap[i*3+1]
					@texinfo[:data][i][:b]=colormap[i*3+0]
					i+=1
				end
			end
		end
	end
	
	def read16BitsRLE(data)
		i=0
		while(i<(@texinfo[:width]*@texinfo[:height])) do
			# read first byte
			packet_header=data.read(1).unpack("C")[0]
			size=1+(packet_header & 0x7f)
			
			if ((packet_header & 0x80)!=0)
				# run-length packet
				color = data.read(1).unpack("C")[0] + (data.read(1).unpack("C")[0] << 8);
				size.times do 
					@texinfo[:data][i]={:a=>255}
					@texinfo[:data][i][:r]=(((color & 0x7C00) >> 10) << 3)
					@texinfo[:data][i][:g]=(((color & 0x03E0) >>  5) << 3)
					@texinfo[:data][i][:b]=(((color & 0x001F) >>  0) << 3)
					i+=1
				end
			else
				# non run-length packet
				size.times do
					color = data.read(1).unpack("C")[0] + (data.read(1).unpack("C")[0] << 8);
					@texinfo[:data][i]={:a=>255}
					@texinfo[:data][i][:r]=(((color & 0x7C00) >> 10) << 3)
					@texinfo[:data][i][:g]=(((color & 0x03E0) >>  5) << 3)
					@texinfo[:data][i][:b]=(((color & 0x001F) >>  0) << 3)
					i+=1
				end
			end
		end
	end
	
	def read24BitsRLE(data)
		i=0
		while(i<(@texinfo[:width]*@texinfo[:height])) do
			# read first byte
			packet_header=data.read(1).unpack("C")[0]
			size=1+(packet_header & 0x7f)
			
			if ((packet_header & 0x80)!=0)
				# run-length packet
				rgba=data.read(3).unpack("CCC")
				size.times do 
					@texinfo[:data][i]={:a=>255}
					@texinfo[:data][i][:b]= rgba[0]
					@texinfo[:data][i][:g]= rgba[1]
					@texinfo[:data][i][:r]= rgba[2]
					i+=1
				end
			else
				# non run-length packet
				size.times do
					@texinfo[:data][i]={:a=>255}
					@texinfo[:data][i][:b]= data.read(1).unpack("C")[0]
					@texinfo[:data][i][:g]= data.read(1).unpack("C")[0]
					@texinfo[:data][i][:r]= data.read(1).unpack("C")[0]
					i+=1
				end
			end
		end
	end
	
	def read32BitsRLE(data)
		i=0
		while(i<(@texinfo[:width]*@texinfo[:height])) do
			# read first byte
			packet_header=data.read(1).unpack("C")[0]
			size=1+(packet_header & 0x7f)
			
			if ((packet_header & 0x80)!=0)
				# run-length packet
				rgba=data.read(4).unpack("CCCC")
				size.times do 
					@texinfo[:data][i]={}
					@texinfo[:data][i][:b]= rgba[0]
					@texinfo[:data][i][:g]= rgba[1]
					@texinfo[:data][i][:r]= rgba[2]
					@texinfo[:data][i][:a]= rgba[3]
					i+=1
				end
			else
				# non run-length packet
				size.times do
					@texinfo[:data][i]={}
					@texinfo[:data][i][:b]= data.read(1).unpack("C")[0]
					@texinfo[:data][i][:g]= data.read(1).unpack("C")[0]
					@texinfo[:data][i][:r]= data.read(1).unpack("C")[0]
					@texinfo[:data][i][:a]= data.read(1).unpack("C")[0]
					i+=1
				end
			end
		end
	end
	
	def write_png(path)
		png = ChunkyPNG::Image.new(@texinfo[:width], @texinfo[:height], ChunkyPNG::Color::TRANSPARENT)
		@texinfo[:width].times do |i|
			@texinfo[:height].times do |j|
				id=i+@texinfo[:width]*j
				png[i,@texinfo[:height]-1-j] = ChunkyPNG::Color.rgba(@texinfo[:data][id][:r],@texinfo[:data][id][:g],@texinfo[:data][id][:b],@texinfo[:data][id][:a])
			end
		end
		png.save(path, :interlace => false)
		#png_data = image.to_blob(:fast_rgba)
	end
	
	def get_png
		png = ChunkyPNG::Image.new(@texinfo[:width], @texinfo[:height], ChunkyPNG::Color::TRANSPARENT)
		@texinfo[:width].times do |i|
			@texinfo[:height].times do |j|
				id=i+@texinfo[:width]*j
				png[i,@texinfo[:height]-1-j] = ChunkyPNG::Color.rgba(@texinfo[:data][id][:r],@texinfo[:data][id][:g],@texinfo[:data][id][:b],@texinfo[:data][id][:a])
			end
		end
		#png.save(path, :interlace => false)
		png.to_blob(:fast_rgba)
	end
end

=begin


file=''
File.open("other.tga","rb") {|f| file=f.read()}
tga=TgaLoader.new
tga.readTga(file)
tga.write_png("test.png")
=end