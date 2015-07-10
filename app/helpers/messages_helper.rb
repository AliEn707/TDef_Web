module MessagesHelper
	def messages(obj, arg={})
		message_path({id: obj.id, type: obj.class}.merge(arg))
	end
end
