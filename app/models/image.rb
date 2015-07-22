#require 'lzma'
require 'binary_serializer'
class Image < ActiveRecord::Base
	belongs_to :imageable, polymorphic: true, touch: true
	serialize :data, BinarySerializer
	
	FORMATS=["png", "jpeg", "gif"]
	
	def raw
		self.data
	end
	
	def url
		Rails.application.routes.url_helpers.get_image_path("#{self.id}.png")
	end
	
	def full_url
		"http://#{request.host_with_port}#{Rails.application.routes.url_helpers.get_image_path("#{self.id}.png")}"
	end
	
	def base64
		"data:"+self.format+";base64,"+Base64.encode64(self.data)
	end
	
	def raw_resized(x, y=0, opt={})#TODO: add croping
		FastImage.resize(StringIO.new(self.raw), x, y, opt).read rescue self.raw
	end
	
	def resize!(x, y=0, opt={})
		self.data=self.raw_resized(x,y,opt)
	end
	
	def convert_to(type)
		self.resize(0,0,{out_type: type.to_sym})
	end
	
	def convert_to_png!
		self.resize!(0,0,{out_type: :png})
	end
	
	
	
	def size
		FastImage.size(StringIO.new(self.raw))
	end
	
	def type
		FastImage.type(StringIO.new(self.raw)).to_s
	end
	
	def type?
		FORMATS.include?(self.type)
	end
end
