class ImagesController < ApplicationController
	  def get
		id = params['id'][/\d+/].to_i
		puts id,params["id"]
		data=nil
		format=nil
		if ($redis) then
			data=$redis.get('image/data_'+id.to_s)
			format=$redis.get('image/format_'+id.to_s)
		end
		if (!data || !format)
			image=Image.find(id)
			data=image.raw
			format=image.format
			if ($redis) then
				$redis.set('image/data_'+id.to_s,data, ex: 18*60)
				$redis.set('image/format_'+id.to_s,format, ex: 18*60)
			end
		end
		send_data(data, type: format, filename: "#{id}.png")	
	end
	
end
