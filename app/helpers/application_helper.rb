module ApplicationHelper
	def checkbox_onoff(name,label,value='1',checked=false)
		o= '<div class="slideThree">
			<input class="hidden" type="checkbox" value="'+value+'" id="'+name+'" name="'+name+(checked==true ? '" checked' : '"')+'/>
			<label for="'+name+'">'+label+'</label>
		</div>
		'
		o.html_safe
	end
	
	def checkbox_slide_small(name,label,value='1',checked=false)
		o= '<div class="slideOne">
			<input class="hidden" type="checkbox" value="'+value+'" id="'+name+'" name="'+name+(checked==true ? '" checked' : '"')+'/>
			<label for="'+name+'">'+label+'</label>
		</div>
		'
		o.html_safe
	end
	
	def current_locale
		locale=I18n.default_locale
		if !current_user.nil? then
			 locale=current_user.locale
		else
			locale=cookies[:locale] if !cookies[:locale].nil?
		end
		locale
	end
	
	def menu 
		a=[]
		if !current_user.nil?
			a<<[{'name'=>t(:hello)+' '+current_user.name.to_s,'right'=>true},
					{'name'=>t(:edit_registration),'path' => edit_user_registration_path},
					{'name'=>t(:sign_out),'path'=>destroy_user_session_path,:method => :delete}]
			if current_user.admin
				a<<[{'name'=>t(:content)},
						{'name'=>t(:map_editor),'path'=>map_edit_path},
						{'name'=>t(:maps),'path'=>map_all_path},
						{'name'=>t(:servers),'path'=>server_all_path},
						{'name'=>t(:locales),'path'=>locales_all_path}]
			end
#			a<<{'name'=>Dir[Rails.root.join('locales', '*.{rb,yml}').to_s],'path'=>'#'}
		else
			a<<[{'name'=>t(:sign_in), 'path'=> new_user_session_path}]
			a<<[{'name' => t(:sign_up) , 'path' => new_user_registration_path}]			
		end
		locale=[]
		locale<<{'name'=>current_locale,'right'=>true}
		['ru','en'].each do |l_l|
			locale<<{'name'=>l_l,'path'=>"/locale?locale="+l_l}
		end
		a<<locale
		a	
	end
	
	def qrcode(path)
		RQRCode::QRCode.new(path, :size => 7, :level => :h )
	end
	
	def qrcode64(data,size=2)
		qr = qrcode(data)
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
		("data:image/png;base64,"+Base64.encode64(png.to_blob)).html_safe
	end
	
end
