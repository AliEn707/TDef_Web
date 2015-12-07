class Forum < ActiveRecord::Base
	belongs_to :user, touch: true
	has_many :threads, :dependent => :destroy
	has_many :topics, as: :topicable, :dependent => :destroy
end
