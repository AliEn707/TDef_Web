class PostsController < ApplicationController
	before_action :set_post, only: [:show, :edit, :update, :destroy]
	before_action :authenticate_user!, except: [:show,:index]
	before_action :is_admin?, except: [:show,:index]

	# GET /posts
	# GET /posts.json
	def index
		@posts = Post.order(:created_at=>:desc)
		@posts = @posts.where(Post.arel_table[:created_at].lt(Time.now-60.minutes)) if (!current_user || !current_user.admin)
	end

	# GET /posts/1
	# GET /posts/1.json
	def show
	end

	# GET /posts/new
	def new
		@post = Post.new(lang: current_user.locale)
		@langs = $available_locales
	end

	# GET /posts/1/edit
	def edit
		@used_langs=@post.translations.select(:lang).map{|l| l.lang}
		@langs = $available_locales-@used_langs
	end

	# POST /posts
	# POST /posts.json
	def create
		@post = Post.new(post_params.merge(user: current_user))
		if @post.save then
			set_images
			Image.where(imageable_id: nil, imageable_type: @post.class.name).where(Image.arel_table[:created_at].lt(Time.now-60.minutes)).destroy_all
			@post.add_translations
			redirect_to posts_path, notice: t("posts.created")
		else
			render action: 'new', alert: t("posts.not_created")
		end
	end

	# PATCH/PUT /posts/1
	# PATCH/PUT /posts/1.json
	def update
		if @post.update(post_params)
			@post.images.where.not(id: params["img_ids"]).destroy_all
			set_images
			redirect_to posts_path, notice: t("posts.updated") 
		else
			render action: 'edit' , alert: t("posts.not_updated")
		end
	end

	# DELETE /posts/1
	# DELETE /posts/1.json
	def destroy
		@post.destroy
		redirect_to posts_url
	end

	private
	
	def set_images
		@post.images=Image.where(id: params["img_ids"]) if !params["img_ids"].nil? 
	end
	# Use callbacks to share common setup or constraints between actions.
	def set_post
		@post = Post.find(params[:id])
	end

	# Never trust parameters from the scary internet, only allow the white list through.
	def post_params
		params.require(:post).permit(:title, :lang, :description, :preview, :user_id)
	end
end
