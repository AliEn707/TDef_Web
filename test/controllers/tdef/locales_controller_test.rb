require 'test_helper'

class Tdef::LocalesControllerTest < ActionController::TestCase
  setup do
     sign_in(users(:admin))
  end

  test "should get show_all" do
    get :show_all
    assert_response :success
  end

  test "should get get" do
    get :get
    assert_response :success
    assert_not_nil ExecJS.compile(response.body)
  end

end
