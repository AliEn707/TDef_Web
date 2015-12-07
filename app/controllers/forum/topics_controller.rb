class Forum::TopicsController < ApplicationController
  before_action :set_forum_topic, only: [:show, :edit, :update, :destroy]

  # GET /forum/topics
  # GET /forum/topics.json
  def index
    @forum_topics = Forum::Topic.all
  end

  # GET /forum/topics/1
  # GET /forum/topics/1.json
  def show
  end

  # GET /forum/topics/new
  def new
	@data=JSON.parse(p Base64.decode64(params['data']))
    @forum_topic = Forum::Topic.new
  end

  # GET /forum/topics/1/edit
  def edit
  end

  # POST /forum/topics
  # POST /forum/topics.json
  def create
    @forum_topic = Forum::Topic.new(forum_topic_params.merge(user: current_user))

    respond_to do |format|
      if @forum_topic.save
        format.html { redirect_to @forum_topic, notice: t("forum.topics.created") }
        format.json { render action: 'show', status: :created, location: @forum_topic }
      else
        format.html { render action: 'new' }
        format.json { render json: @forum_topic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /forum/topics/1
  # PATCH/PUT /forum/topics/1.json
  def update
    respond_to do |format|
      if @forum_topic.update(forum_topic_params)
        format.html { redirect_to @forum_topic, notice: t("forum.topics.updated") }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @forum_topic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /forum/topics/1
  # DELETE /forum/topics/1.json
  def destroy
    @forum_topic.destroy
    respond_to do |format|
      format.html { redirect_to forum_topics_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_forum_topic
      @forum_topic = Forum::Topic.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def forum_topic_params
      params.require(:forum_topic).permit(:name, :description, :user_id, :closed, :topicable_id, :topicable_type)
    end
end
