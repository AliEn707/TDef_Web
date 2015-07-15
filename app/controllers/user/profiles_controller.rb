class User::ProfilesController < ApplicationController
	before_action :authenticate_user!
	before_action :is_admin?, only: [:index, :new, :create, :destroy]
	before_action :check_owner!, only: [:edit, :update]
	before_action :set_user_profile, only: [:show, :edit, :update, :destroy]

	#User::Profile.where(User::Profile.arel_table[:properties].matches("%#{string}%"))

	# GET /user/profiles
	# GET /user/profiles.json
	def index
		@user_profiles = User::Profile.all
	end

	# GET /user/profiles/1
	# GET /user/profiles/1.json
	def show
	end

	# GET /user/profiles/new
	def new
		@user_profile = User::Profile.new
	end

	# GET /user/profiles/1/edit
	def edit
	end

	# POST /user/profiles
	# POST /user/profiles.json
	def create
	@user_profile = User::Profile.new(user_profile_params)

		respond_to do |format|
			if @user_profile.save
				format.html { redirect_to @user_profile, notice: 'Profile was successfully created.' }
			else
				format.html { render action: 'new' }
			end
		end
	end

	# PATCH/PUT /user/profiles/1
	# PATCH/PUT /user/profiles/1.json
	def update
		Image.where(id: params["old_images"]).destroy_all if params["old_images"]
		respond_to do |format|
			if @user_profile.update(user_profile_params)
				image=@user_profile.image
				if (image && image.size!=[128,128]) then
					image.resize!(128,128) 
					image.save
				end
				format.html { redirect_to @user_profile, notice: 'Profile was successfully updated.' }
			else
				format.html { render action: 'edit' }
			end
		end
	end

	# DELETE /user/profiles/1
	# DELETE /user/profiles/1.json
	def destroy
		@user_profile.destroy
		respond_to do |format|
			format.html { redirect_to user_profiles_url }
		end
	end
	
	def find
		
	end
	
	def search
		@user_profiles=User::Profile.where(User::Profile.arel_table[:properties].matches("%#{params[:string]}%"))
		render 'index', layout: false
	end
	
	private
	def check_owner!
		redirect_to "/404.html" if (!current_user.admin && current_user.profile.id!=params[:id].to_i)
	end
	
	def profile_check
		super if (action_name!="edit" && action_name!="update")
	end
	
	# Use callbacks to share common setup or constraints between actions.
	def set_user_profile
		@user_profile = User::Profile.find(params[:id])
	end

	# Never trust parameters from the scary internet, only allow the white list through.
	def user_profile_params
		params.require(:user_profile).permit( :user_id ).merge(clean_properties)
	end
	
	def clean_properties
		{properties: params[:user_profile][:properties].each{|k,v| params[:user_profile][:properties].delete(k) if (v.blank? || !User::Profile::PROPERTIES.include?(k))}}
	end
end
