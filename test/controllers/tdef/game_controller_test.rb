require 'test_helper'

class Tdef::GameControllerTest < ActionController::TestCase
  setup do
     sign_in(users(:admin))
  end

  test "should get game" do
    get :game
    assert_response :success
  end

end
