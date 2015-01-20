class MapController < ApplicationController
	before_action :authenticate_user!
	before_action :is_admin?
	def textures
		textures=[
			'/textures/map/1', '/textures/map/2', 
			'/textures/wall/1','/textures/wall/1_small',
			'/textures/wall/10','/textures/wall/11', '/textures/wall/mask',
			'/textures/none','/textures/wall/qr'
			]
		previews=[
			'/textures/map/1.png', '/textures/map/2.png', 
			'/textures/wall/1.png','/textures/wall/1_small.png',
			'/textures/wall/10.png','/textures/wall/11.png', '/textures/wall/mask.png',
			'/textures/none.png','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaAQAAAAAQ03yvAAACDElEQVR4nGWTQYcjQRTH30yH1VR0k1PYS2jm1FRUM5ZEFX0awnyGJeQ0LLkOIx8g5LqE/QxLs6emWvclpHTTp1DEEPY0dKRoQ0p2jjsvdSp+/v/3f1Xv3YJTOqMGPI8C3MJ/55Y3lLa9XIb5BZGjGKbLrYhW0EEEwBE02hAqsBvArozt/FgAJp6UvsvNhcszIpk/C1oDUTS+QeRyTjUhHzfvIj+TTuYPkkxtliucbUv4vnvx4HmQ4n5m0vIOOMXXF4HeQAtYWJmxZonqHI3KgQRs2TPIrR4FZnLX78/tHBFRSGEkY7qVONt79d74tqJb/Drf71++7M/OQQ0AZfPWBqbRov+n94A0VQBvLvz467otIuku3Sdq3Z9RjfppoxhqiBJZDFAdy3dPhHtccwdpJiaowASdwBCkaYk2EYGNIAXSyKzlYaZn64yibA9nyEr5qsITdnOKkHa55zl6hdwOj6AT0Q2VHSO38W8IWCHzOD4gN0J+gQ6dqDEV0pj7QT2o7LaSc1THGYlt7E2rKSj8c0lNlaxpZXNEhpM3nwIdWu8JkfIYv+7DXX4K93jivZ8xrVufRBaR5+NcLYb0W1HdoX7ysjoxvmtdTlDqmw5YYVjFTIHnugGxJkWjiIvnWiTlMBtNWBYgDQAdA0mUos7VbnfN+dRl0Xp5tdsfw26YOs0er3bbMt1PmdX0c4J/xlPvL6mIbs0AAAAASUVORK5CYII='
			]
		send_data(	("var textures="+textures.inspect+
					"\nvar previews="+previews.inspect).html_safe, filename: 'textures.js')
	end
	
	def edit
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
			m_m.image=Image.create(data: request.POST['img']) if !request.POST['img'].nil?
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
