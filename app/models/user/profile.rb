class User::Profile < ActiveRecord::Base
	belongs_to :user, touch: true
	has_one :image, as: :imageable, dependent: :destroy
	serialize :properties, JSON
	
	
	PROPERTIES=["NAME","SURNAME","BDAY","OTHER","EMAIL","PHONE","CONTRY","CITY","URL","NICK"]
	SHORT_PROPERTIES=["NAME","SURNAME","NICK"]
	NECESSARY_PROPERTIES=["NAME","NICK"]
end
