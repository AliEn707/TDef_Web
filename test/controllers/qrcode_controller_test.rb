require 'test_helper'

class QrcodeControllerTest < ActionController::TestCase
  test "should get qrcode" do
    get :qrcode
    assert_response :success
  end

end
