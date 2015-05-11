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
  end

  # GET /post/translations/new
  def new
    @post_translation = Post::Translation.new(post_id:params["post_id"], user: current_user)
    post=@post_translation.post#Post.where(id: params["post_id"]).first
    @used_langs=post.translations.select(:lang).map{|l| l.lang}<<post.lang
    @langs = $available_locales-@used_langs

  end

  # GET /post/translations/1/edit
  def edit
	@used_langs=@post_translation.post.translations.where.not(id: @post_translation.id).select(:lang).map{|l| l.lang}<<@post_translation.post.lang
	@langs = $available_locales-@used_langs
  end

  # POST /post/translations
  # POST /post/translations.json
  def create
    @post_translation = Post::Translation.new(post_translation_params)

    respond_to do |format|
      if @post_translation.save
        format.html { redirect_to @post_translation, notice: 'Translation was successfully created.' }
        format.json { render action: 'show', status: :created, location: @post_translation_translation }
      else
        format.html { render action: 'new' }
        format.json { render json: @post_translation.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /post/translations/1
  # PATCH/PUT /post/translations/1.json
  def update
    respond_to do |format|
      if @post_translation.update(post_translation_params)
        format.html { redirect_to @post_translation, notice: 'Translation was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @post_translation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /post/translations/1
  # DELETE /post/translations/1.json
  def destroy
    @post_translation.destroy
    respond_to do |format|
      format.html { redirect_to post_translations_url }
      format.json { head :no_content }
    end
  end
  
	def post
		@post_translation=Post::Translation.eager_load(:user).where(post_id: params[:id], lang: params["lang"]).first
		render layout:false
	end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post_translation
      @post_translation = Post::Translation.where(id: params[:id]).first
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_translation_params
      params.require(:post_translation).permit(:lang, :post_id, :user_id, :title, :description)
    end
end
