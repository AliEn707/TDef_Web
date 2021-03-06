class TypeTexturesContainer
	attr_accessor :ids
	def initialize(data=nil,ids=nil)
		@data=data || {}
		@ids=ids || {}
	end
	
	def [](a)
		return @data[a] if @data[a]
		load(a)
		return @data[a]
	end

	def []=(a,b)
		if (@ids[a]) then
			remove(a)
		end
		@data[a]=b
		if (defined?(b.id))
			@ids[a]={"img"=> b.id}
		else
			@ids[a]=b
		end
	end
	
	def attr(a,b,c=nil)
		return if !@ids[a]
		if (c) then
			if (c=="") then
				@ids[a].delete(b)
			else
				@ids[a][b]=c
			end
		else
			@ids[a][b]
		end
	end
	
	def remove(a)
		return if !@ids[a]
		load(a) if !@data[a] 
		@data[a].destroy if @data[a]
		clear(a)
	end
	
	def clean!
		@ids.keys.each {|k| @ids.delete(k) if (k)}
	end
	
	def keys
		@ids.keys
	end
	
	def to_hash
		out=@ids.dup
		out.each do |k,v| 
			if (self[k]) then 
				out[k]["src"]=self[k].url
			end
			out[k].delete("img")
		end
	end
	
	def to_json
		@ids.each{|k,v| @ids.delete(k) if v.nil?}
		@ids.to_json
	end
	
	def self.from_json(data)
		new.from_json(data)
	end
	
	def from_json(data)
		@ids=JSON.load(data) || {}
		self
	end
	
	def to_s
		"#{self.class}.new(#{@data.inspect},#{@ids.inspect})"
	end
	
	alias inspect to_s

	private
	
	def clear(a)
		@data[a]=nil
		@ids[a]=nil
	end
	
	def load(a)
		@data[a]=Image.where(id:@ids[a]["img"]).first if @ids[a]
	end
end

class TypeTexturesSerializer
	#need to get TypeTexturesContainer
	def self.load(value)
		TypeTexturesContainer.from_json(value)
	end
	
	#value is TypeTexturesContainer
	def self.dump(value)
		value.to_json
	end
end
