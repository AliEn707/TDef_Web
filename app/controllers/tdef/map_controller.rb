class Tdef::MapController < ApplicationController
	before_action :authenticate_user!, except: [:get]
	before_action :is_admin?, except: [:get]
	def textures
		@textures=[
			'textures/map/1', 'textures/map/2', 
			'textures/wall/1','textures/wall/1_small',
			'textures/wall/10','textures/wall/11', 'textures/wall/mask',
			'textures/none',
			'imgtest/1','imgtest/2','imgtest/11','imgtest/12',
			'imgtest/21','imgtest/22',
			'imgtest/111','imgtest/112','imgtest/121','imgtest/122'
			].map!{|t| "/#{t}.png"} << ActionController::Base.helpers.asset_path('tree.png')
		render :formats => :js, layout: false
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
			m_m=Tdef::Map.find_by(name: request.POST['mapname']) || Tdef::Map.new(name: request.POST['mapname'], user: current_user)
			m_m.description=request.POST['description'] if !request.POST['description'].nil? 
			m_m.data=request.POST['completeInfo'] if !request.POST['completeInfo'].nil? 
			m_m.grafics=request.POST['saveTexturesField'] if !request.POST['saveTexturesField'].nil?
			if (!request.POST['img'].nil?) then
				m_m.image.delete if (!m_m.image.nil?)
				m_m.image=Image.create(format: request.POST['img'][/[\w ]*\/[\w]*/],data: Base64.decode64(request.POST['img'].sub(/data:[\w \/]*;base64,/,""))) 
			end
			m_m.completed=true if (!request.POST['complete'].nil?) 
			m_m.last_modified=current_user
			m_m.save
			notice="tdef.map_saved"
		end
		if request.get? && request.GET['id'] then
			m_m=Tdef::Map.find(request.GET['id'])
			m_m.completed=true if request.GET.include?('complete')
			m_m.last_modified=current_user
			m_m.save
		end
		redirect_to tdef_map_all_path, notice: t(notice)
	end
	
	def show_all
#		params[:id]
		@maps=Tdef::Map.all
	end
	
	def delete
		Tdef::Map.find(params[:id]).destroy
		redirect_to :back
	end
	
	def get
		out=Rails.cache.fetch('TDef_map_'+params["name"].to_s,expires_in: 15.minutes) do
			data={}
			map=Tdef::Map.where(name: params["name"]).first
			data["mp"]=map.data
			data["mg"]=map.grafics
			data.to_json
		end
		send_data(out,type: "application/json; charset=utf-8", filename: "#{params["name"]}.json", disposition:'inline')	
	end
end
