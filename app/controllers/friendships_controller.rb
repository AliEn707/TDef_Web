class FriendshipsController < ApplicationController
	def show
		@user=current_user
	end
	
	def create
		@friendship = current_user.friendships.build(:friend_id => params[:id])
		if @friendship.save
			flash[:notice] = "Added friend."
			redirect_to root_url
		else
			flash[:error] = "Unable to add friend."
			redirect_to root_url
		end
	end

	def destroy
		@friendship = current_user.friendships.where(friend_id: params[:id]).first
		@friendship.destroy
		@friendship = current_user.inverse_friendships.where(user_id: params[:id]).first
		@friendship.destroy
		flash[:notice] = "Removed friendship."
		redirect_to current_user
	end
end
