class TypeParamsSerializer
	#need to get Hash
	def self.load(value)
		out={}
		value.split("\n").each do |l|
			k,v=l.split(" ") 
			out[k]=v
		end if value
		return out
	end
	
	#value is Hash
	def self.dump(value)
		p values
		out=[]
		value.each do |k,v|
			out<<"#{k} #{v}\n" if k!="textures"
		end
		return out.join
	end
end


class TypeTexturesSerializer
	#need to get Hash
	def self.load(value)
		TypeTexturesContainer.from_json(value)
	end
	
	#value is Hash
	def self.dump(value)
		value.to_json
	end
end
