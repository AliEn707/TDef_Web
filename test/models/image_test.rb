require 'test_helper'

class ImageTest < ActiveSupport::TestCase
  setup do
  end
  
  test "png: size must be Array" do
    image = images(:png)
    assert image.size.instance_of?(Array)
  end

  test "jpeg: size must be Array" do
    image = images(:png)
    assert image.size.instance_of?(Array)
  end
end
