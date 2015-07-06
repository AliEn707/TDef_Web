class User::Profile < ActiveRecord::Base
	belongs_to :user
	has_one :image, as: :imageable, dependent: :destroy
	serialize :properties
	
end
