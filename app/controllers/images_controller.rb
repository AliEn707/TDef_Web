class ImagesController < ApplicationController
	  def get
		id = params['id'][/\d+/].to_i
		data=nil
		if ($redis) then
			data=$redis.get('image/data_'+id.to_s)
			format=$redis.get('image/format_'+id.to_s)
		end
		if (!data)
			puts "jhdbhbhb"
			image=Image.find(id)
			data=image.raw
			format=image.format
			if ($redis) then
				$redis.set('image/data_'+id.to_s,data)
				$redis.set('image/format_'+id.to_s,format)
			end
		end
		send_data(data, type: format, filename: "#{id}.png")	
	end
	
end
