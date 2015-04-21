class Tdef::Map < ActiveRecord::Base
	has_one :image, as: :imageable, dependent: :destroy
	
	def icon
		Rails.cache.fetch('map/url_'+self.inspect,expires_in: 12.minutes) do
			self.image.url
		end
	end
end
