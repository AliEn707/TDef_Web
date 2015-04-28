class MessagesController < ApplicationController
	before_action :authenticate_user!
	def create
		@message=Message.new(message_params)
		type=:notice
		notice=""
		if (@message.save)
			notice="message_sent"
		else
			type=:alert
			notice="message_error"
		end
		redirect_to :back, type => t(notice)
	end

	def show
		@messages=current_user.messages.includes(:msg_dest);
		@income_messages=current_user.income_messages.includes(:user);
	end
	
	private
	def message_params
		params.require(:message).permit(:data, :user_id, :msg_dest_id, :msg_dest_type)
	end	 
end
