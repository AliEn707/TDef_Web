require 'fileutils'



class Tdef::TempClientFile < ActiveRecord::Base
	
	def TempClientFile.apply_changes
		f_f=ClientUpdate.create(status: 1)
		#wait clients to not update
		while (ClientUpdate.where("status not like 1").size!=0)
			sleep 2
		end	
		TempClientFile.all.each do |r_r|
			c_c=ClientFile.find_by(path: r_r.path)
			c_c=ClientFile.create(path: r_r.path) if c_c.nil?
			c_c.timestamp=Time.now.to_i#r_r.timestamp
			c_c.file_type=c_c.file_type
			c_c.save
			r_r.delete
			#add move file from temp
			#FileUtils.rm_f(ClientFile.path+r_r.path)
			#FileUtils.mv(TempClientFile.path+r_r.path, ClientFile.path+r_r.path)
		end
		f_f.delete
		#send mess to public
	end
	
	def TempClientFile.types(a=nil)
		if a.nil?
			return {
					'tex'=>1,
					'loc'=>2,
					'map'=>3,
					'mgraf'=>4,
				}
		else
			
		end
	end
	
	def TempClientFile.path
		"../test/"
	end
	def TempClientFile.erase
		TempClientFile.all.each {|i| i.delete}
	end
end
