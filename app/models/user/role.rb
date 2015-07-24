class User::Role < ActiveRecord::Base
	belongs_to :user, touch: true
	serialize :accept, JSON
end
