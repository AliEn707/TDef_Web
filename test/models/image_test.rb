require 'test_helper'

class ImageTest < ActiveSupport::TestCase
  setup do
  end
  
  test "png: size must be Array" do
    image = images(:png)
    assert image.size.instance_of?(Array)
  end

  test "jpeg: size must be Array" do
    image = images(:jpeg)
    assert image.size.instance_of?(Array)
  end
  
  test "png: size changes" do
    image = images(:png)
    size=image.size
    assert image.resize!(0,0).size==size, "0,0 must not changesize"
    assert image.resize!(800,80).size!=size, "size must changes"
  end
  
  test "png: size must changes proportional" do
    image = images(:png)
    size=image.size
    assert image.resize!(1234).size[1]!=size[1], "size must changes proportional"
    assert image.resize!(0,1243).size[0]!=size[0], "size must changes proportional"
  end
  
end
