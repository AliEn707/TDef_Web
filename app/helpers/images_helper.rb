module ImagesHelper
	#renders application/_image_upload
	def image_loader(obj)
		@image_owner=obj
		render "image_upload"
	end
end
