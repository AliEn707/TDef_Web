class Forum::Thread < ActiveRecord::Base
	belongs_to :user, touch: true
	belongs_to :forum, touch: true
	has_many :topics, as: :topicable, :dependent => :destroy
end
