class QrcodeController < ApplicationController
	before_action :authenticate_user!, except: [:qrcode]
	def qrcode
		url=params["url"].split("?")[0];
		data="";
		format="image/png";
		if (url==request.referrer) then
			data=Rails.cache.fetch('qrcode/'+url,expires_in: 12.minutes) {generate(data) rescue ""}
		end
		send_data(data, type: format, filename: "#{url.sub("http://","").gsub("/","_")}.png");	
	end

	private
	def create_qrcode(path)
		RQRCode::QRCode.new(path, :size => 7, :level => :h )
	end
	
	def generate(data,size=2)
		qr = create_qrcode(data)
		png = ChunkyPNG::Image.new(qr.modules.size*size, qr.modules.size*size , ChunkyPNG::Color::TRANSPARENT)
		qr.modules.each_index do |x| 
			 qr.modules.each_index do |y| 
				size.times do |i|
					size.times do |j|
						png[x*size+i,y*size+j]=(qr.dark?(x,y))? ChunkyPNG::Color.rgba(0,0,0,255) : ChunkyPNG::Color.rgba(255,255,255,255)
					end 
				end 
			end 
		end 
		return png.to_blob;
	end
end
