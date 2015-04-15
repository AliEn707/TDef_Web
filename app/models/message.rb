class Message < ActiveRecord::Base
	belongs_to :user, touch: true
	belongs_to :msg_dest, polymorphic: true, touch: true

end
