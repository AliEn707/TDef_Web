class Server < ActiveRecord::Base
	def get_info
		begin
			sock = TCPSocket.open(self.hostname, self.port)
		rescue SystemCallError
			puts err.inspect
		else
			sock.write [105].pack("c")#send 'i'
			data={}
			data[:port]=sock.read(4).unpack("V")
			data[:num]=sock.read(4).unpack("V")
			data[:startport]=sock.read(4).unpack("V")
			p data
			sock.close
		end
	end
	
end
