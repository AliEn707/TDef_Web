#require 'lzma'
class Image < ActiveRecord::Base
	belongs_to :imageable, polymorphic: true, touch: true
	
	def raw
		self.data
	end
	
	def url
		Rails.application.routes.url_helpers.get_image_path("#{self.id}.png")
	end
	
	def base64
		"data:"+self.format+";base64,"+Base64.encode64(self.data)
	end
	
	def raw_resized(x,y=0)
		FastImage.resize(StringIO.new(self.raw), x, y).read rescue self.raw
	end
	
	def resize!(x,y=0)
		self.data=(FastImage.resize(StringIO.new(self.raw), x, y).read rescue self.raw)
	end
	
	def cut!(sizex,sizey,from=0,to=0)
		
	end
end
