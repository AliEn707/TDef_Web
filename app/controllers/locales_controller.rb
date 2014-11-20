class LocalesController < ApplicationController
  before_action :authenticate_user!
  def show_all
	  @locales=Locale.all
  end
end
