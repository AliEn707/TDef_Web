class Image < ActiveRecord::Base
	belongs_to :imageable, polymorphic: true
	
	def raw
		Base64.decode64(self.data.sub("data:image/png;base64,","")).html_safe
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
