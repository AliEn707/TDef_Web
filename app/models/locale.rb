class Locale < ActiveRecord::Base
	has_many :locale_datas, dependent: :destroy
#Locale.first.write_file	
	def write_file()
		path="locale/"+self.name+'.txt'
		File.open(ClientFile.path+path, 'wb') do |f|
			f.write [0xFFFE].pack("n")
		end
		File.open(ClientFile.path+path, 'at',encoding: 'UTF-16LE') do |f|
			self.locale_datas.each do |l|
				f.puts l.key+" "+l.value
			end
		end
		file=TempClientFile.where(["path = ?",path]).first
		file=TempClientFile.create(path: path) if (file.nil?)
#		file.timestamp = Time.now.to_i
		file.save
	end
end
