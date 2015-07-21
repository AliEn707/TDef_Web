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
		render layout: false
	end

	def show
		@id=params["id"]
		@type=params["type"]
		respond_to do |format|
			format.js do
				messages_for_show
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
	
	def messages_for_show
		id=params["id"]
		type=params["type"]
		@messages=[]
		if (params["from"])
			@time=Time.at(params["from"].to_i)
			arel=Message.arel_table[:created_at]
			messages=current_user.messages.where(msg_dest_id: id, msg_dest_type: type).where(arel.gt(@time))
			income_messages=current_user.income_messages.where(user_id: id).where(arel.gt(@time))
			
			@messages=income_messages.union(messages).order(:created_at) #not work((
#			@messages=(@messages.to_a+@income_messages.to_a).uniq.sort_by! { |obj| obj.created_at }  #alternate? if prev not works
		end
		#mey be need
	end
end
