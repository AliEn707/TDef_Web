require 'test_helper'

class Tdef::MapControllerTest < ActionController::TestCase
  setup do
     sign_in(users(:admin))
  end

  test "should get edit" do
    get :edit
    assert_response :success
  end

end
