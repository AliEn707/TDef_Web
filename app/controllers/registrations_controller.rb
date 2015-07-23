class RegistrationsController < Devise::RegistrationsController
	def create
		if verify_recaptcha
			super
		else
			build_resource(sign_up_params)
			clean_up_passwords(resource)
			flash.now[:alert] = t("recaptcha_error")      
			flash.delete :recaptcha_error
			render :new
		end
	end
	
	def new
		super
	end
	
	private
	
	def sign_up_params
		params.require(:user).permit(:name, :email, :password, :password_confirmation,:current_password, :locale, :time_zone)
	end

	def account_update_params
		params.require(:user).permit(:name, :email, :password, :password_confirmation,:current_password, :locale, :time_zone)
	end
end