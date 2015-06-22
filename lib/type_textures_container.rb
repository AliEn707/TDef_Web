class TypeTexturesContainer
	def initialize
		@data={}
		@ids={}
	end
	
	def [](a)
		return @data[a] if @data[a]
		load(a)
		return @data[a]
	end

	def []=(a,b)
		if (@ids[a]) then
			@data[a]	if 
			remove(a)
		end
		@data[a]=b
		if (defined?(b.id))
			@ids[a]=b.id
		else
			@ids[a]=b
		end
	end
	
	def remove(a)
		load(a) if !@data[a] 
		@data[a].destroy
		clear(a)
	end
	
	def to_json
		@ids.to_json
	end
	
	def self.from_json(data)
		@ids=JSON.load(data)
	end
	
	private
	
	def clear(a)
		@data[a]=nil
		@ids[a]=nil
	end
	
	def load(a)
		@data[a]=Image.where(id:@ids[a]).first if @ids[a]
	end
end