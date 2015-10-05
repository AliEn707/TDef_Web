require 'test_helper'
require 'type_params_serializer'

class TypeParamsSerializerTest < ActiveSupport::TestCase
   test "hash keys mast be strings" do
      serializer=TypeParamsSerializer
      data={"test1"=> 1, "test2"=> 2}
      assert serializer.load(serializer.dump(data))==data, "not matched"
   end
end
