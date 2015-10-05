class Tdef::Player < ActiveRecord::Base
	has_one :auth
	belongs_to :user
	
	after_create :add_auth
	
	private
	
	def add_auth
		self.auth=Tdef::Player::Auth.create(player: self)
	end
end
