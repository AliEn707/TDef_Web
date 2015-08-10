class Tdef::GameController < ApplicationController
	before_action :authenticate_user!
	def game
	end
  
	def access
		token=rand(2147483647*2)-2147483647#rand in max int
		send_data "function access(){return {token:#{token},name:'#{current_user.email}'};}" , filename:"access.js"
	end
end
