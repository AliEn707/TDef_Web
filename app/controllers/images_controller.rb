class ImagesController < ApplicationController
  def get
	id = params['id']
	image=Image.find_by(id)
	data=""
	if (image) then
		data=Base64.decode64(image.data.sub("data:image/png;base64,","")).html_safe
	end
	
	send_data(data, :type =>"image/png", filename: 'textures.js')			
  end
end
