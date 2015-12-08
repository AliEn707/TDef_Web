class Forum < ActiveRecord::Base
	belongs_to :user, touch: true
	has_many :threads, :dependent => :destroy
	has_many :topics, as: :topicable, :dependent => :destroy
	
	def messages
		o=Message.where(id:0) #start empty query
		topics.each{ |t| p o=o.union(t.messages)}
		threads.each{|tr| tr.topics.each{ |t| p o=o.union(t.messages)}}
		o.order(created_at: :asc)
	end
end
