require 'json'

begin
  Oj
  [Object, Array, FalseClass, Float, Hash, Integer, NilClass, String, TrueClass].each do |klass|
    klass.class_eval do
      # Dumps object in JSON (JavaScript Object Notation). See www.json.org for more info.
      def to_json(options = nil)
        Oj.dump(self, options)
      end
    end
  end
rescue Exception
  #Oj not available
end