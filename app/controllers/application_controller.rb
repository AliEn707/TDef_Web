class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :set_locale
 
  def set_locale
	if !params[:locale].nil? && !current_user.nil?
		current_user.locale=params[:locale]
		current_user.save
		redirect_to :back
	end
    I18n.locale = user_signed_in? ? current_user.locale.to_sym : I18n.default_locale
  end
	
end
