class Tdef::Player < ActiveRecord::Base
	belongs_to :user
	has_one :auth
	has_many :logs
	
	after_create :add_auth
	
	private
	
	def add_auth
		self.auth=Tdef::Player::Auth.create(player: self)
	end
end
