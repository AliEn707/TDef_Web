class BinarySerializer
	def self.load(value)
		Zlib::Inflate.inflate(Base64.decode64(value)) if (value)
	end
	
	def self.dump(value)
		Base64.encode64(Zlib::Deflate.deflate(value,9)) if (value)
	end
end
