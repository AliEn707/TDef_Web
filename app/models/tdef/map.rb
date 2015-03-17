class Tdef::Map < ActiveRecord::Base
	has_one :image, as: :imageable, dependent: :destroy
	
	def icon
		image.url
	end
end
