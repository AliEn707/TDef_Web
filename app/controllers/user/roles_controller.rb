class User::RolesController < ApplicationController
	before_action :authenticate_user!
	before_action :is_admin?
	
	private
	
end