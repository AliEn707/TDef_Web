class Post::TranslationsController < ApplicationController
	before_action :set_post_translation, only: [:show, :edit, :update, :destroy]
	before_action :authenticate_user!, except: [:show,:post]
	before_action :is_admin?, except: [:show,:post]
  # GET /post/translations
  # GET /post/translations.json
  def index
	redirect_to "/404.html"
	#@posts = Post::Translation.all
  end

  # GET /post/translations/1
  # GET /post/translations/1.json
  def show
	@post=@post_translation
  end

  # GET /post/translations/new
  def new
	@post_translation = Post::Translation.new(post_id:params["post_id"], lang: current_user.locale)
	@post=@post_translation.post#Post.where(id: params["post_id"]).first
	@used_langs=@post.translations.select(:lang).map{|l| l.lang}<<@post.lang
	@langs = $available_locales-@used_langs
	
  end

  # GET /post/translations/1/edit
  def edit
	@post=@post_translation.post
	@used_langs=@post_translation.post.translations.where.not(id: @post_translation.id).select(:lang).map{|l| l.lang}<<@post.lang
	@langs = $available_locales-@used_langs
  end

  # POST /post/translations
  # POST /post/translations.json
  def create
	@post_translation = Post::Translation.new(post_translation_params.merge(user: current_user))#create can only current_user
	if @post_translation.save then
		set_images
		Image.where(imageable_id: nil, imageable_type: @post_translation.class.name).where(Image.arel_table[:created_at].lt(Time.now-60.minutes)).destroy_all
		redirect_to posts_path, notice: t("posts.translations.created") 
	else
		render action: 'new' , alert: t("posts.translations.not_created")
	end
  end

  # PATCH/PUT /post/translations/1
  # PATCH/PUT /post/translations/1.json
  def update
	if @post_translation.update(post_translation_params)
		@post_translation.images.where.not(id: params["img_ids"]).destroy_all
		set_images
		redirect_to posts_path, notice: t("posts.translations.updated") 
	else
		render action: 'edit', alert: t("posts.translations.not_updated") 
	end
  end

  # DELETE /post/translations/1
  # DELETE /post/translations/1.json
  def destroy
	@post_translation.destroy
	redirect_to posts_url
  end
  
	def post
#		@post=@post_translation
		@post=Post::Translation.eager_load(:user).where(post_id: params[:id], lang: params["lang"]).first
		render layout:false
	end

  private
	def set_images
		@post_translation.images=Image.where(id: params["img_ids"]) if !params["img_ids"].nil?
	end
	# Use callbacks to share common setup or constraints between actions.
	def set_post_translation
	  @post_translation = Post::Translation.where(id: params[:id]).first
	end

	# Never trust parameters from the scary internet, only allow the white list through.
	def post_translation_params
	  params.require(:post_translation).permit(:lang, :post_id, :title, :description)
	end
end
