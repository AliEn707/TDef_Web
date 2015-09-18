class ImagesController < ApplicationController
	before_action :authenticate_user!, except: [:get]
	  def get
		format= params[:format] || "png" 
		not_found if (format!="png")
		id = params['id'][/\d+/].to_i
		image=Rails.cache.fetch("image/#{id}",expires_in: 6.hours){Image.find(id)}
		#image=Image.find(id)
		if (stale?(image, public: true)) then
			data=if (params["size"].nil?) then
					image.raw
				else
					image.raw #add resize
				end
			not_found if (format!="png")
			
			file_format="image/#{format}"#image.format
			send_data(data, type: file_format, filename: "#{id}.#{format}", disposition:'inline')	
		end
	end
	
	def upload
		@image = Image.new(image_params)
		#TODO: rewrite
		if (@image.type?) then
			@image.convert_to_png! if (@image.type!="png")
			set_dimentions
			@image=nil  if (!@image.save)
		else
			@image=nil 
		end
		respond_to do |format|
			format.js
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
		return params.require(:image).permit(:imageable_id, :imageable_type).merge({data: data, format: format})
	end
	
	def set_dimentions
		begin
			dimentions=@image.imageable_type.constantize::IMAGE_DIMENTIONS 
			need=[dimentions[:width] || 0, dimentions[:height] || 0]
			return if (need==[0,0])
			size=@image.size
			case dimentions[:method]
				when 'max'
					if (size[0]>need[0] || size[1]>need[1]) then
						scale=1
						scale=need[0]/size[0] if (need[0]!=0)
						scale=need[1]/size[1] if (need[1]!=0 && scale>need[1]/size[1])
						@image.resize!(size[0]*scale,size[1]*scale) if (scale!=1) #TODO: rewrite
					end
				when 'set'
					@image.resize!(need[0],need[1]) if (need!=size)
				when 'fit'
					scale=1
					scale=need[0]/size[0] if (need[0]/size[0]!=0)
					scale=need[1]/size[1] if (need[1]/size[1]!=0 && scale>need[1]/size[1])
					@image.resize!(size[0]*scale,size[1]*scale) if (scale!=1) #TODO: rewrite
			else
				nil # we don't know what to do
			end
		rescue 
			nil
		end
	end
end
