class Tdef::Map < ActiveRecord::Base
	has_one :image, as: :imageable, dependent: :destroy
	belongs_to :user, touch: true
	belongs_to :last_modified, class_name: "User", touch: true
	
	def icon
		Rails.cache.fetch('map/url_'+self.inspect,expires_in: 10.minutes) do
			self.image.url
		end
	end
end
