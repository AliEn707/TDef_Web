class Forum < ActiveRecord::Base
	belongs_to :user, touch: true
	has_many :threads, :dependent => :destroy
	has_many :topics, as: :topicable, :dependent => :destroy
	
	def messages
		o=Message.where(msg_dest_id: topics.select(:id), msg_dest_type: "Forum::Topic").union(Message.where(msg_dest_id: threads.joins(:topics).select("forum_topics.id"), msg_dest_type: "Forum::Topic")) #start empty query
		o.order(created_at: :asc)
	end
end
