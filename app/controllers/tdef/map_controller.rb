class Tdef::MapController < ApplicationController
	before_action :authenticate_user!
	before_action :is_admin?
	def textures
		textures=[
			'/textures/map/1', '/textures/map/2', 
			'/textures/wall/1','/textures/wall/1_small',
			'/textures/wall/10','/textures/wall/11', '/textures/wall/mask',
			'/textures/none',
			'/imgtest/1','/imgtest/2','/imgtest/11','/imgtest/12','/imgtest/21','/imgtest/22','/imgtest/111','/imgtest/112','/imgtest/121','/imgtest/122'
			]
		send_data( ("var textures="+textures.map{|t| t+=".png"}.inspect).html_safe, filename: 'textures.js')
	end
	
	def edit
		id=params["id"]
		@map={}
		if !id.nil?
			map=Tdef::Map.find(id)
			@map=map.attributes
		end
	end
	
	def upload
		if request.post?
			m_m=Tdef::Map.find_by(name: request.POST['mapname'])
			m_m=Tdef::Map.new(name: request.POST['mapname']) if m_m.nil?
			m_m.data=request.POST['completeInfo'] if !request.POST['completeInfo'].nil? 
			m_m.grafics=request.POST['saveTexturesField'] if !request.POST['saveTexturesField'].nil?
			m_m.image=Image.create(format: request.POST['img'][/[\w ]*\/[\w]*/],data: Base64.decode64(request.POST['img'].sub(/data:[\w \/]*;base64,/,""))) if !request.POST['img'].nil?
			m_m.completed=((!request.POST['complete'].nil?)? true : false) 
			m_m.writed=false
			m_m.save
		end
		if request.get? && request.GET['id'] then
			m_m=Tdef::Map.find(request.GET['id'])
			m_m.completed=true if request.GET.include?('complete')
			m_m.save
		end
#		if !m_m.nil?
#			m_m.write_file if m_m.completed
#		end
#		File.open("out.txt","a"){|f| f.write(request.POST['img']);f.puts}
		redirect_to tdef_map_all_path
	end
	
	def show_all
#		params[:id]
		@maps=Tdef::Map.all
	end
	
	def complete
		#write all complete maps to disk
		redirect_to tdef_map_all_path
	end
	
	def delete
		Tdef::Map.find(params[:id]).destroy
		redirect_to :back
	end
end
