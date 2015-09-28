class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception
	before_action :set_locale
	before_action :set_timezone
	before_action :profile_check
	
	def ping
		render text: '"OK"', layout: false
	end
	
	def not_found
		raise ActionController::RoutingError.new('Not Found')
	end
	
	def set_locale
		@locale=I18n.default_locale
		if !current_user.nil?
			@locale=current_user.locale
			if !params[:locale].nil?
				current_user.locale=params[:locale]
				current_user.save
				redirect_to :back
			end
		else
			@locale=cookies[:locale] if !cookies[:locale].nil?
			if !params[:locale].nil?
				cookies[:locale]=params[:locale]
				redirect_to :back
			end
		end
		I18n.locale = @locale
	end
	
	private	
	
	def is_admin?
		redirect_to "/404.html" if current_user.nil? || !current_user.admin
	end
	
        def profile_check
		if (!current_user.nil? && controller_name!="sessions")
			profile=current_user.profile
			prop=[]
			User::Profile::NECESSARY_PROPERTIES.each do |k|
				prop << k if (profile.properties[k].blank?)
			end if (profile && profile.properties)
			redirect_to edit_user_profile_path(profile), notice: t("user.profile.property_not_filled", property: prop.map!{|m| t("user.profile.#{m}")}.join(" ")) if prop.size!=0
		end
	end
	
	def set_timezone
		Time.zone = current_user.time_zone if !current_user.nil?
	end
	
end
