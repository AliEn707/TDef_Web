module MessagesHelper
	def messages(obj, arg={})
		message_path({id: obj.id, type: obj.class}.merge(arg))
	end
	
	def message_tag(dir="in")
		content_tag :div, class: "div-message-#{dir}" do
			content_tag :span, class: "well well-small message-#{dir}" do
				yield
			end
		end
	end
end
