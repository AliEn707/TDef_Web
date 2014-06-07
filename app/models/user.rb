class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
 # attr_accessible :email, :password, :password_confirmation, :remember_me
	def create
		User.create(user_params)
	end
	
	def use_params
		params.require(:user).permit(:email, :password, :password_confirmation, :remember_me)
	end
end
