class Forum::ThreadsController < ApplicationController
  before_action :set_forum_thread, only: [:show, :edit, :update, :destroy]

  # GET /forum/threads
  # GET /forum/threads.json
  def index
    @forum_threads = Forum::Thread.all
  end

  # GET /forum/threads/1
  # GET /forum/threads/1.json
  def show
  end

  # GET /forum/threads/new
  def new
	@forum_id=params["forum_id"]
    @forum_thread = Forum::Thread.new
  end

  # GET /forum/threads/1/edit
  def edit
  end

  # POST /forum/threads
  # POST /forum/threads.json
  def create
    @forum_thread = Forum::Thread.new(forum_thread_params.merge(user: current_user))

    respond_to do |format|
      if @forum_thread.save
        format.html { redirect_to @forum_thread, notice: t("forum.threads.created") }
        format.json { render action: 'show', status: :created, location: @forum_thread }
      else
        format.html { render action: 'new' }
        format.json { render json: @forum_thread.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /forum/threads/1
  # PATCH/PUT /forum/threads/1.json
  def update
    respond_to do |format|
      if @forum_thread.update(forum_thread_params)
        format.html { redirect_to @forum_thread, notice: t("forum.threads.created") }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @forum_thread.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /forum/threads/1
  # DELETE /forum/threads/1.json
  def destroy
    @forum_thread.destroy
    respond_to do |format|
      format.html { redirect_to forum_threads_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_forum_thread
      @forum_thread = Forum::Thread.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def forum_thread_params
      params.require(:forum_thread).permit(:name, :description, :user_id, :closed, :forum_id)
    end
end
