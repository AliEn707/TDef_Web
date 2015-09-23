require 'test_helper'

class ImagesControllerTest < ActionController::TestCase
  test "should get get" do
    get :get, id: 2
    assert_response :success
  end

end
