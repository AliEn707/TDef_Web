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
			remove(a)
		end
		@data[a]=b
		if (defined?(b.id))
			@ids[a]={img: b.id}
		else
			@ids[a]=b
		end
	end
	
	def attr(a,b,c=nil)
		if (c)
			@ids[a][b]=c
		else
			@ids[a][b]
		end
	end
	
	def remove(a)
		load(a) if !@data[a] 
		@data[a].destroy
		clear(a)
	end
	
	def clean!
		keys.each {|k| delete(k)}
	end
	
	def to_json
		@ids.to_json
	end
	
	def keys
		@ids.keys
	end
	
	def to_hash
		out=@ids.dup
		out.each do |k,v| 
			out[k]["src"]=self[k].url
			out[k].delete(:img)
		end
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
		@data[a]=Image.where(id:@ids[a][:img]).first if @ids[a]
	end
end