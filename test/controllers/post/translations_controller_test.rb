require 'test_helper'

class Post::TranslationsControllerTest < ActionController::TestCase
  setup do
    sign_in(users(:admin))
    @post_translation = post_translations(:one)
  end

  test "should get new" do
    get :new, post_id: 1
    assert_response :success
  end

  test "should create post_translation" do
    assert_difference('Post::Translation.count') do
      post :create, post_translation: { description: @post_translation.description, lang: @post_translation.lang, post_id: @post_translation.post_id, title: @post_translation.title }
    end

    assert_redirected_to posts_path
  end

  test "should show post_translation" do
    get :show, id: @post_translation, :format=>:js
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @post_translation
    assert_response :success
  end

  test "should update post_translation" do
    patch :update, id: @post_translation, post_translation: { description: @post_translation.description, lang: @post_translation.lang, post_id: @post_translation.post_id, title: @post_translation.title }
    assert_redirected_to posts_path
  end

  test "should destroy post_translation" do
    assert_difference('Post::Translation.count', -1) do
      delete :destroy, id: @post_translation
    end

    assert_redirected_to posts_path
  end
end
