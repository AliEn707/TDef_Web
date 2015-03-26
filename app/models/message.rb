class Message < ActiveRecord::Base
	belongs_to :user, touch: true
	belongs_to :msg_dest, polymorphic: true, touch: true
	after_initialize :set_time
	
	def set_time
		self.sended_at=DateTime.now
	end
	
end
