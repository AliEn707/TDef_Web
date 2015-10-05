require 'test_helper'

class Tdef::GameControllerTest < ActionController::TestCase
  setup do
     sign_in(users(:admin))
  end

  test "should get game" do
    get :game
    assert_response :success
  end

  test "should get init" do
    get :init
    assert_response :success
  end

  test "should get access" do
    get :access
    assert_response :success
    assert_not_nil ExecJS.compile(response.body)
  end

end
