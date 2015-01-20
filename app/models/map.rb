class Map < ActiveRecord::Base
	has_one :image, as: :imageable, dependent: :destroy
#Map.first.write_file	
	def write_file()
		data={}
		data['map']=self.data
		data['mgraf']=self.grafics
		['map','mgraf'].each do |p_p|
			path="maps/"+self.name+ext[p_p]
			File.open(TempClientFile.path+path, 'wt') do |f|
				f.write data[p_p].gsub("\r","")
			end
			file=TempClientFile.where(["path = ?",path]).first
			file=TempClientFile.create(path: path) if (file.nil?)
	#		file.timestamp = Time.now.to_i
			file.file_type=type[p_p]
			file.save
		end
		self.writed=true
		self.save
	end
	
	def type
		a={}
		a['map']=TempClientFile.types['map']
		a['mgraf']=TempClientFile.types['mgraf']
		a
	end
	
	def ext
		{'map'=>".mp",'mgraf'=>".mg"}
	end
	
	def icon
		Rails.application.routes.url_helpers.get_image_path(image.id)
	end
end
