class ImagesController < ApplicationController
	  def get
		id = params['id'][/\d+/].to_i
		image=Rails.cache.fetch('image/'+id.to_s,expires_in: 12.minutes) {Image.find(id)}
		#image=Image.find(id)
		data=image.raw
		format=image.format
		send_data(data, type: format, filename: "#{id}.png")	
	end
	
end
