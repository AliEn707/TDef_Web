class Tdef::GameController < ApplicationController
	before_action :authenticate_user!
	def game
	end
  
	def access
		auth=current_user.player.auth
		auth.token=rand(2147483647)#rand in max int
		auth.save
		send_data "function access(){return {token:#{auth.token},name:'#{current_user.email}'};}" , filename:"access.js", disposition:'inline'
	end
	
	def init
		render :formats=>[:js]
	end
end
