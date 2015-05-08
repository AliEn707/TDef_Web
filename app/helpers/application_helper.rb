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
	
	def title(page_title)
		content_for(:title) { page_title }
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
	
	def for_admin
		yield if (!current_user.nil? && current_user.admin)
	end
	
	def menu 
		a=[]
		if !current_user.nil?
			a<<[{'name'=>t(:hello)+' '+current_user.name.to_s,'right'=>true},
					{'name'=>t(:edit_registration),'path' => edit_user_registration_path},
					{'name'=>t(:sign_out),'path'=>destroy_user_session_path,:method => :delete}]
			tdef=[{'name'=>t(:tdef)},
					{'name'=>t(:game),'path'=>tdef_game_path},
				]
			social=[{'name'=>t(:social)},
					{'name'=>t(:news),'path'=>posts_path},
					{'name'=>t(:friends),'path'=>friends_path},
					{'name'=>t(:messages),'path'=>messages_path}]
			if (current_user.admin) then
				tdef+=[
					{'name'=>t(:shell),'path'=>tdef_shell_path},
					{'name'=>t(:map_editor),'path'=>tdef_map_edit_path},
					{'name'=>t(:maps),'path'=>tdef_map_all_path},
					{'name'=>t(:servers),'path'=>tdef_server_all_path},
					{'name'=>t(:locales),'path'=>tdef_locales_all_path},
					{'name'=>t(:flash_test),'path'=>"/ExternalInterfaceExample.html"},
					{'name'=>t(:audio_test),'path'=>"/audiotest.html"}
				]
			end
			a<<tdef
			a<<social
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
	
	def qrcode(data,size=2)
		return qrcode_path+"?url="+data;
	end
	
	def cacheTimestamp
		current_user.email+current_user.updated_at
	end
	
	def markdown(text)
#		Redcarpet::Render::SmartyPants.render(
		$markdown.render(text.to_s).html_safe
	end
end
