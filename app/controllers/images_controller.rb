class ImagesController < ApplicationController
	before_action :authenticate_user!, except: [:get]
	  def get
		format= params[:format] || "png" 
		not_found if (format!="png")
		id = params['id'][/\d+/].to_i
		image=Rails.cache.fetch("image/#{id}",expires_in: 12.minutes){Image.find(id)}
		#image=Image.find(id)
		if (stale?(image, public: true)) then
			raw=if (params["size"].nil?) then
					image.raw
				else
					image.raw #add resize
				end
			data=if (format=="png")
					raw
				else
					Rails.cache.fetch("image/#{id}.#{format}",expires_in: 12.minutes){raw}# TODO: add convertion to jpg and gif
				end
			file_format="image/#{format}"#image.format
			send_data(data, type: file_format, filename: "#{id}.#{format}")	
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
	
        def profile_check
	end
	def set_timezone
	end
	def set_locale
	end
	
	def image_params
		data=params["image"]["file"].read
		format=params["image"]["file"].content_type
		#TODO add convertion if not "image/png"
		return params.require(:image).permit(:imageable_id, :imageable_type).merge({data: data, format: format})
	end
end
