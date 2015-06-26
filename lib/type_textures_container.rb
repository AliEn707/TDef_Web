class TypeTexturesContainer
	attr_accessor :ids
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
		@data[a].destroy
		clear(a)
	end
	
	def clean!
		keys.each {|k| delete(k)}
	end
	
	def keys
		@ids.keys
	end
	
	def to_hash
		out=@ids.dup
		out.each do |k,v| 
			out[k]["src"]=self[k].url
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
	
	private
	
	def clear(a)
		@data[a]=nil
		@ids[a]=nil
	end
	
	def load(a)
		@data[a]=Image.where(id:@ids[a]["img"]).first if @ids[a]
	end
end