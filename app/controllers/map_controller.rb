class MapController < ApplicationController
	before_action :authenticate_user!
	before_action :is_admin?
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
		if request.post?
			m_m=Map.find_by(name: request.POST['mapname'])
			m_m=Map.create(name: request.POST['mapname']) if m_m.nil?
			m_m.data=request.POST['completeInfo'] if !request.POST['completeInfo'].nil? 
			m_m.grafics=request.POST['saveTexturesField'] if !request.POST['saveTexturesField'].nil?
			m_m.icon=request.POST['img'] if !request.POST['img'].nil?
			m_m.completed=((!request.POST['complete'].nil?)? true : false) 
			m_m.writed=false
			m_m.save
		end
		if request.get? && request.GET['id'] then
			m_m=Map.find(request.GET['id'])
			m_m.completed=true if request.GET.include?('complete')
			m_m.save
		end
#		if !m_m.nil?
#			m_m.write_file if m_m.completed
#		end
		redirect_to map_all_path
	end
	
	def show_all
#		params[:id]
		@maps=Map.all
	end
	
	def complete
		#write all complete maps to disk
		redirect_to map_all_path
	end
end
