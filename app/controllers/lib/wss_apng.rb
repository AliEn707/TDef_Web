require_relative 'wss_tga'
require 'zlib'
require 'rubygems/package'

#only for writing
#all tga file must be similar depth
class WssTgaToApng
	def initialize(ftime=1,fps=13)
		@frames=[]
		@ftime=ftime
		@fps=fps
	end
	
	def add_frame(f)
		@frames << f
	end
	
	def generate()
		counter=0
		frame=@frames[0].get_png
		contents=frame.split("IDAT")
		puts "errors" if contents.size>2
		chunk={}
		chunk[:size]=contents[0][-4..-1].unpack("N")
		chunk[:data]=contents[1].split('IEND')[0]
		chunk[:data]=chunk[:data].slice(0,chunk[:data].size-8)
		datastr=contents[0].slice(0,contents[0].size-4)
		data=StringIO.new datastr
		data.write(contents[0].slice(0,contents[0].size-4))
		
		content=[@frames.size,0].pack("NN")
		type="acTL" 
		data.write([content.length].pack("N")+type+content)
		data.write([Zlib.crc32(content, Zlib.crc32(type))].pack("N"))
		
		content=[counter,@frames[0].w,@frames[0].h,0,0,@ftime,@fps,0,0].pack("NNNNNnncc")
		type="fcTL" 
		data.write([content.length].pack("N")+type+content)
		data.write([Zlib.crc32(content, Zlib.crc32(type))].pack("N"))
		
		content=chunk[:data]
		type="IDAT" 
		data.write([content.length].pack("N")+type)
		data.write(content)
		data.write([Zlib.crc32(content, Zlib.crc32(type))].pack("N"))
		
		if @frames.size>1 then
			1.step(@frames.size-1,1) do |i|
				frame=@frames[i].get_png
				contents=frame.split("IDAT")
				puts "errors" if contents.size>2
				chunk={}
				chunk[:size]=contents[0][-4..-1].unpack("N")[0]
				chunk[:data]=contents[1].split('IEND')[0]
				chunk[:data]=chunk[:data].slice(0,chunk[:data].size-8)
		
				counter+=1
				content=[counter,@frames[0].w,@frames[0].h,0,0,@ftime,@fps,0,0].pack("NNNNNnncc")
				type="fcTL" 
				data.write([content.length].pack("N")+type+content)
				data.write([Zlib.crc32(content, Zlib.crc32(type))].pack("N"))
				
				counter+=1
				content=[counter].pack("N")+chunk[:data]
				tmp=StringIO.new content
				tmp.write([counter].pack("N"))
				tmp.write(chunk[:data])
				type="fdAT" 
				data.write([chunk[:size]+4].pack("N")+type)
				data.write(content)
				data.write([Zlib.crc32(content, Zlib.crc32(type))].pack("N"))
			end
		end
		
		content=""
		type="IEND" 
		data.write([content.length].pack("N")+type+content)
		data.write([Zlib.crc32(content, Zlib.crc32(type))].pack("N"))
		
		datastr
	end
	
	#we can have info.cfg 1.tga, 2.tga ...
	def fromTar(stream)
		contents={}
		frames=0
		apng=WssTgaToApng.new
		Gem::Package::TarReader.new(stream) do |tar|
			tar.each do |entry|
				if entry.full_name!="info.cfg"
					contents[entry.full_name]=entry.read
				end
			end
			contents.size.times do |i|
				tga=WssTga.new
				tga.readTgaStr(contents[(i+1).to_s+'.tga'])
				apng.add_frame(tga)
			end
		end
		apng.generate
	end
end

=begin
file=''
apng=WssTgaToApng.new

File.open("test.tga","rb") {|f| file=f.read()}
tga=WssTga.new
tga.readTgaStr(file)
apng.add_frame(tga)

File.open("test1.tga","rb") {|f| file=f.read()}
tga=WssTga.new
tga.readTgaStr(file)
apng.add_frame(tga)

data=apng.generate
File.open("other.png","wb") {|f| f.write(data)}
#tga.write_png("test.png")
#StringIO.new str
=end

a=WssTgaToApng.new
out=nil
File.open("tar/arc.tar","rb") {|f| out=a.fromTar(f)}
File.open("other.png","wb") {|f| f.write(out)}
