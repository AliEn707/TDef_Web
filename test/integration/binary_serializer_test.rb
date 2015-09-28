require 'test_helper'
require 'binary_serializer'

class BinarySerializerTest < ActiveSupport::TestCase
   test "dump_load" do
      serializer=BinarySerializer
      data="test string"
      assert serializer.load(serializer.dump(data))==data, "not matched"
   end
end
