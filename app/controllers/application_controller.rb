class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception
	before_action :set_locale
	def set_locale
		locale=I18n.default_locale
		if !current_user.nil?
			locale=current_user.locale
			if !params[:locale].nil?
				current_user.locale=params[:locale]
				current_user.save
				redirect_to :back
			end
		else
			locale=cookies[:locale] if !cookies[:locale].nil?
			if !params[:locale].nil?
				cookies[:locale]=params[:locale]
				redirect_to :back
			end
		end
		I18n.locale = locale
	end
	
	def not_found
		raise ActionController::RoutingError.new('Not Found')
	end
	
	def is_admin?
		if !current_user.nil?
			redirect_to "/404.html" if !current_user.admin
		end
	end
	
	def qr_toggle
		cookies[:qrcode]=true if cookies[:qrcode].nil?
		cookies[:qrcode]=cookies[:qrcode] ? false : true
	end
end
