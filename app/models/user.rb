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
	has_many :locale_datas, class_name: "Tdef::Locale::Data"
	has_many :maps, class_name: "Tdef::Map"
	has_many :modified_maps, class_name: "Tdef::Map" , foreign_key: :last_modified_id
	#friends
	has_many :friendships
	has_many :friends_out, :through => :friendships, :source => :friend
	has_many :inverse_friendships, :class_name => "Friendship", :foreign_key => "friend_id"
	has_many :friends_in, :through => :inverse_friendships, :source => :user
	
	has_many :news, class_name: "Post"
	
	has_one :profile
	
	after_create :add_profile
	def friends
#		User.where(id: friendships.select(:friend_id)).where(id: inverse_friendships.select(:user_id))
		friends_in.where(id: friendships.select(:friend_id))
	end
	
	#users that sent request for friending
	def friends_income
		friends_in.where.not(id: friendships.select(:friend_id))
	end
	
	#users for that was sent request for friending
	def friends_outcome
		friends_out.where.not(id: inverse_friendships.select(:user_id))
#		User.where.not(id: friendships.select(:friend_id)).where(id: inverse_friendships.select(:user_id))
	end
	
	def add_profile
		self.profile=User::Profile.create(user: self)
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