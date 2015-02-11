class ImagesController < ApplicationController
	  def get
		id = params['id'][/\d+/].to_i
		image=Image.find(id)
		send_data(image.raw, type: image.format, filename: "#{id}.png")	
	end
	
end
