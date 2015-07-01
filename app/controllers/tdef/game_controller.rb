class Tdef::GameController < ApplicationController
  def game
  end
  
	def access
		send_data "function access(){return {token:'smth',id:#{Time.now.to_i}};}" , filename:"access.js"
	end
end
