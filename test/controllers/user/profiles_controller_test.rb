require 'test_helper'

class User::ProfilesControllerTest < ActionController::TestCase
  setup do
    @user_profile = user_profiles(:one)
    sign_in(users(:one))
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_profiles)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_profile" do
    assert_difference('User::Profile.count') do
      post :create, user_profile: { properties: @user_profile.properties, user_id: @user_profile.user_id }
    end

    assert_redirected_to user_profile_path(assigns(:user_profile))
  end

  test "should show user_profile" do
    get :show, id: @user_profile
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @user_profile
    assert_response :success
  end

  test "should update user_profile" do
    patch :update, id: @user_profile, user_profile: { properties: @user_profile.properties, user_id: @user_profile.user_id }
    assert_redirected_to user_profile_path(assigns(:user_profile))
  end

  test "should destroy user_profile" do
    assert_difference('User::Profile.count', -1) do
      delete :destroy, id: @user_profile
    end

    assert_redirected_to user_profiles_path
  end
end
