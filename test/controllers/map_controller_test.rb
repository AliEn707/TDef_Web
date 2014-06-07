require 'test_helper'

class MapControllerTest < ActionController::TestCase
  test "should get map_edit" do
    get :map_edit
    assert_response :success
  end

end
