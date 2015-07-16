class FriendshipsController < ApplicationController
	before_action :authenticate_user!
	def show
		@user=current_user
	end
	
	def create
		@friendship = current_user.friendships.build(:friend_id => params[:id])
		if @friendship.save
			redirect_to :back, notice: "Added friend."
		else
			redirect_to :back, error:  "Unable to add friend."
		end
	end

	def destroy
		@friendship = current_user.friendships.where(friend_id: params[:id]).first
		@friendship.destroy if (@friendship)
		@friendship = current_user.inverse_friendships.where(user_id: params[:id]).first
		@friendship.destroy if (@friendship)
		redirect_to :back, notice: "Removed friendship."
	end
	
	private
	
        def profile_check
	end
	def set_timezone
	end
	def set_locale
	end
end
