class TypeParamsSerializer
	#need to get Hash
	def self.load(value)
		out={}
		value.split("\n").each do |l|
			k,v=l.split(" ") 
			out[k]=(!v[/[\+\-]?\d+(\.\d+)?/].nil?) ? (v["."].nil? ? v.to_i : v.to_f) : v
		end if value
		return out
	end
	
	#value is Hash
	def self.dump(value)
		out=[]
		value.each do |k,v|
			out<<"#{k} #{v}\n" if (k!="textures" && v!="")
		end
		return out.join
	end
end

