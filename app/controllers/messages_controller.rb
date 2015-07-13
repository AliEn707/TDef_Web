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
		@id=params["id"]
		@type=params["type"]
		@messages=current_user.messages.where(msg_dest_id: @id, msg_dest_type: @type);
		@income_messages=current_user.income_messages.where(id: @id);
		if (params["from"])
			@time=Time.at(params["from"].to_i)
			arel=Message.arel_table[:created_at]
			@messages=@messages.where(arel.gt(@time))
			@income_messages=@income_messages.where(arel.gt(@time))
		end
		#mey be need
#		@messages=@income_messages.union(@messages).order(:created_at)
		respond_to do |format|
			format.js do
				@messages=@income_messages.union(@messages).order(:created_at)
				render layout: false
			end
			format.html
		end
	end
	
	def all
		@messages=current_user.messages.includes(:msg_dest);
		@income_messages=current_user.income_messages.includes(:user);
	end
	
	private
	def message_params
		params.require(:message).permit(:data, :user_id, :msg_dest_id, :msg_dest_type)
	end	 
end
