class Forum::Thread < ActiveRecord::Base
	belongs_to :user, touch: true
	belongs_to :forum, touch: true
	has_many :topics, as: :topicable, :dependent => :destroy
	
	def messages
		Message.where(msg_dest_id: topics.select(:id)).where(msg_dest_type: topics.first.class )
	end
end
