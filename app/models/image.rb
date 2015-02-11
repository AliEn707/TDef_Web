class Image < ActiveRecord::Base
	belongs_to :imageable, polymorphic: true
	
	def raw
		Base64.decode64(self.data)
	end
	
	def url
		Rails.application.routes.url_helpers.get_image_path("#{self.id}.png")
	end
	
	def base64
		"data:"+self.format+";base64,"+self.data
	end
	
	def raw_resized(x,y=0)
		FastImage.resize(StringIO.new(self.raw), x, y).read
	end
	
	def resize!(x,y=0)
		self.data=Base64.encode64(FastImage.resize(StringIO.new(self.raw), x, y).read)
	end
	
	def cut!(sizex,sizey,from=0,to=0)
		
	end
end
