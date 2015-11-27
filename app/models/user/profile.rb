class User::Profile < ActiveRecord::Base
	belongs_to :user
	has_one :image, as: :imageable, dependent: :destroy
	serialize :properties, JSON
	
	
	PROPERTIES=["NAME","SURNAME","BDAY","OTHER","EMAIL","PHONE","CONTRY","CITY","URL","NICK"]
	SHORT_PROPERTIES=["NAME","SURNAME","NICK"]
	NECESSARY_PROPERTIES=["NAME","NICK"]
	UNIQ_PROPERTIES=["NICK"]
	
	def uniq?(cmd=nil)
		p self.properties
		UNIQ_PROPERTIES.each do |k| 
			if (!cmd)
				cmd=User::Profile.arel_table[:properties].matches("%#{{k=>self.properties[k]}.to_json[1...-1]}%")
			else
				cmd=cmd.or(User::Profile.arel_table[:properties].matches("%#{{k=>self.properties[k]}.to_json[1...-1]}%"))
			end
		end
		User::Profile.where.not(:id=>self.id).where(cmd).size == 0
	end
end
