require 'test_helper'

class Tdef::LocalesControllerTest < ActionController::TestCase
  setup do
     sign_in(users(:admin))
  end

  test "should get show_all" do
    get :show_all
    assert_response :success
  end

end
