class Forum::Topic < ActiveRecord::Base
	belongs_to :topicable, polymorphic: true, touch: true
	belongs_to :user, touch: true
	has_many :messages, as: :msg_dest, :class_name => "Message", :dependent => :destroy
end
