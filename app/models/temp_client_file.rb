class TempClientFile < ActiveRecord::Base
	
	def TempClientFile.apply_changes
		TempClientFile.all.each do |r_r|
			c_c=ClientFile.find_by(path: r_r.path)
			c_c=ClientFile.create(path: r_r.path) if c_c.nil?
			c_c.timestamp=Time.now.to_i#r_r.timestamp
			c_c.save
			r_r.delete
			#add move file from temp
		end
		#send mess to public
	end
end
