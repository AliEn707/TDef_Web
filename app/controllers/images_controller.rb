class ImagesController < ApplicationController
	before_action :authenticate_user!, except: [:get]
	  def get
		id = params['id'][/\d+/].to_i
		image=Rails.cache.fetch('image/'+id.to_s,expires_in: 12.minutes) {Image.find(id)}
		#image=Image.find(id)
		if (stale?(image, public: true)) then
			data=image.raw
			format=image.format
			send_data(data, type: format, filename: "#{id}.png")	
		end
	end
	
	def upload
		@image = Image.new(image_params)
		respond_to do |format|
			if @image.save
				format.js
			end
		end
#		render :formats => :js, layout: false
	end
	
	private
	
	def image_params
		data=params["image"]["file"].read
		format=params["image"]["file"].content_type
		#TODO add convertion if not "image/png"
		return params.require(:image).permit(:imageable_id, :imageable_type).merge({data: data, format: format})
	end
end
