require 'test_helper'

class Forum::TopicsControllerTest < ActionController::TestCase
  setup do
    @forum_topic = forum_topics(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:forum_topics)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create forum_topic" do
    assert_difference('Forum::Topic.count') do
      post :create, forum_topic: { closed: @forum_topic.closed, description: @forum_topic.description, name: @forum_topic.name, topicable_id: @forum_topic.topicable_id, topicable_type: @forum_topic.topicable_type, user_id: @forum_topic.user_id }
    end

    assert_redirected_to forum_topic_path(assigns(:forum_topic))
  end

  test "should show forum_topic" do
    get :show, id: @forum_topic
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @forum_topic
    assert_response :success
  end

  test "should update forum_topic" do
    patch :update, id: @forum_topic, forum_topic: { closed: @forum_topic.closed, description: @forum_topic.description, name: @forum_topic.name, topicable_id: @forum_topic.topicable_id, topicable_type: @forum_topic.topicable_type, user_id: @forum_topic.user_id }
    assert_redirected_to forum_topic_path(assigns(:forum_topic))
  end

  test "should destroy forum_topic" do
    assert_difference('Forum::Topic.count', -1) do
      delete :destroy, id: @forum_topic
    end

    assert_redirected_to forum_topics_path
  end
end
