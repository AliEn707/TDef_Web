require 'test_helper'

class QrcodeControllerTest < ActionController::TestCase
  test "should get qrcode" do
    get :qrcode, url: "http://host.test"
    assert_response :success
  end

end
