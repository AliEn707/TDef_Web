class PostsController < ApplicationController
	before_action :set_post, only: [:show, :edit, :update, :destroy]
	before_action :authenticate_user!, except: [:show,:index]
	before_action :is_admin?, except: [:show,:index]

	# GET /posts
	# GET /posts.json
	def index
		@lang=current_user.locale rescue cookies[:locale] || "en"
		@posts = Post.order(:id=>:desc)
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

		respond_to do |format|
			if @post.save
				format.html { redirect_to @post, notice: 'Post was successfully created.' }
				format.json { render action: 'show', status: :created, location: @post }
			else
				format.html { render action: 'new' }
				format.json { render json: @post.errors, status: :unprocessable_entity }
			end
		end
	end

	# PATCH/PUT /posts/1
	# PATCH/PUT /posts/1.json
	def update
		respond_to do |format|
			if @post.update(post_params)
				format.html { redirect_to @post, notice: 'Post was successfully updated.' }
				format.json { head :no_content }
			else
				format.html { render action: 'edit' }
				format.json { render json: @post.errors, status: :unprocessable_entity }
			end
		end
	end

	# DELETE /posts/1
	# DELETE /posts/1.json
	def destroy
		@post.destroy
		respond_to do |format|
			format.html { redirect_to posts_url }
			format.json { head :no_content }
		end
	end

	private
		# Use callbacks to share common setup or constraints between actions.
		def set_post
			@post = Post.find(params[:id])
		end

		# Never trust parameters from the scary internet, only allow the white list through.
		def post_params
			params.require(:post).permit(:title, :lang, :description, :preview, :user_id)
		end
end