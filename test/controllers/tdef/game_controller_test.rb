require 'test_helper'

class Tdef::GameControllerTest < ActionController::TestCase
  test "should get game" do
    get :game
    assert_response :success
  end

end
