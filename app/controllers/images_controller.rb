class ImagesController < ApplicationController
	  def get
		id = params['id']
		image=Image.find_by(id)
		send_data(image.raw, :type =>"image/png", filename: 'image.png')			
	end
	
end
