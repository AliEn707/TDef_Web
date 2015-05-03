class Friendship < ActiveRecord::Base
	belongs_to :user, touch: true
	belongs_to :friend, :class_name => "User", touch: true
end
