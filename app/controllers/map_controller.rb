class MapController < ApplicationController
	before_action :authenticate_user!
	def edit
		@textures=[
			'textures/map/1.png', 'textures/map/2.png', 
			'textures/wall/1.png','textures/wall/1_small.png',
			'textures/wall/10.png','textures/wall/11.png', 'textures/wall/mask.png',
			'textures/none.png'
			]
		end
	def upload
	
	end
end
