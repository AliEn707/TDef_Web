class MapController < ApplicationController
	before_action :authenticate_user!
	def edit
		@textures=[
			'/textures/map/1.png', '/textures/map/2.png', 
			'/textures/wall/1.png','/textures/wall/1_small.png',
			'/textures/wall/10.png','/textures/wall/11.png', '/textures/wall/mask.png',
			'/textures/none.png'
			]
			
		id=params["id"]
		@map={}
		if !id.nil?
			map=Map.find(id)
			@map=map.attributes
		end
	end
	def upload
#		@a=request.POST
		if request.post?
			m_m=Map.find_by(name: request.POST['mapname'])
			m_m=Map.create(name: request.POST['mapname']) if m_m.nil?
			m_m.data=request.POST['completeInfo']
			m_m.grafics=request.POST['saveTexturesField']
			m_m.icon=request.POST['img']
			m_m.save
			#m_m.completed=true if !request.POST['completed'].nil?
		end
		redirect_to map_show_all_path
	end
	
	def show_all
#		params[:id]
		@maps=Map.all
	end
end
