class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable,  :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,:confirmable,:timeoutable,
		:recoverable, :rememberable, :trackable, :validatable
	
	#messaging
	has_many :messages, :dependent => :destroy
	has_many :income_messages, :as =>:msg_dest, :class_name => "Message", :dependent => :destroy
	#another way, not very good
#	has_many :income_messages, :through => :messages, :source =>:msg_dest, :source_type => 'Message', :dependent => :destroy
	has_many :locale_datas
	has_many :maps
	has_many :modified_maps, class_name: "Tdef::Map" , foreign_key: :last_modified_id
	#friends
	has_many :friendships
	has_many :friends_out, :through => :friendships, :source => :friend
	has_many :inverse_friendships, :class_name => "Friendship", :foreign_key => "friend_id"
	has_many :friends_in, :through => :inverse_friendships, :source => :user
	
	def friends
#		User.where(id: friendships.select(:friend_id)).where(id: inverse_friendships.select(:user_id))
		friends_in.joins(:friendships)
	end
	
	#users that sent request for friending
	def friend_income
		friends_in.where.not(id: friendships.select(:friend_id))
	end
	
	#users for that was sent request for friending
	def waiting_outcome
		friends_out.where.not(id: inverse_friendships.select(:user_id))
	end
	
	def create
		User.create(user_params)
	end
	
	def use_params
		params.require(:user).permit(:email, :password, :password_confirmation, :remember_me,:confirmed_at,:admin)
	end
=begin	
	 def self.serialize_from_session(key, salt)
		single_key = key.is_a?(Array) ? key.first : key
		User.where(:id => single_key).entries.first
		p 
	end
=end	
end


=begin
File.open('C:/Output.txt', 'wt', encoding: 'UTF-16LE') do |f|
  f.puts register_mark
end
=end