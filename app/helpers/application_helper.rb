module ApplicationHelper
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
	
	#function that can help set admin other code
	#used for_admin {}.else {} or  for_admin do end.else do end
	def for_admin
		#show admin condition
		yield if (!current_user.nil? && current_user.admin)
		Class.new(Object) do
			attr_accessor :current_user
			def initialize(current_user)
				@current_user=current_user
			end
			def else
				#show else condition
				yield if !(!current_user.nil? && current_user.admin)
			end
		end.new(current_user)
	end
	
	def menu 
		a=[]
		if (!current_user.nil?) then
			a<<[{'name'=>current_user.email.to_s,'right'=>true, 'noprefix'=> true},
					{'name'=>(:edit_registration),'path' => edit_user_registration_path},
					{'name'=>(:sign_out),'path'=>destroy_user_session_path,:method => :delete}]
			tdef=[{'name'=>(:tdef)},
					{'name'=>(:game),'path'=>tdef_game_path},
				]
			social=[{'name'=>(:social)},
					{'name'=>(:profile),'path'=>user_profile_path(current_user.profile)},
					{'name'=>(:search),'path'=>search_path},
					{'name'=>(:friends),'path'=>friends_path},
					{'name'=>(:messages),'path'=>messages_path},
					{'name'=>(:news),'path'=>posts_path}]
			if (current_user.admin) then
				tdef+=[
					{'name'=>(:maps),'path'=>tdef_map_all_path},
					{'name'=>(:map_servers),'path'=>tdef_mapserver_all_path},
					{'name'=>(:locales),'path'=>tdef_locales_all_path},
					{'name'=>(:npc_types),'path'=>tdef_type_npcs_path},
					{'name'=>(:tower_types),'path'=>tdef_type_towers_path},
					{'name'=>(:flash_test),'path'=>"/ExternalInterfaceExample.html"},
					{'name'=>(:audio_test),'path'=>"/audiotest.html"}
				]
			end
			a<<tdef
			a<<social
#			a<<{'name'=>Dir[Rails.root.join('locales', '*.{rb,yml}').to_s],'path'=>'#'}
		else
			a<<[{'name'=>(:sign_in), 'path'=> new_user_session_path, 'show'=>true}]
			a<<[{'name' => (:sign_up) , 'path' => new_user_registration_path}]			
		end
		locale=[]
		locale<<{'name'=> current_locale,'right'=>true, 'noprefix'=> true, 'show' => current_user.nil?}
		$available_locales.each do |l_l|
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
	
	def cache_lang
		"#{current_user.locale}_#{current_user.admin}" rescue  cookies[:locale]
	end
	
	def markdown(text)
#		Redcarpet::Render::SmartyPants.render(
		$markdown.render(text.to_s).gsub("<script>","").gsub("<code>","<pre><code>").gsub("</code>","</code></pre>").gsub("<br>","<br />").gsub("<hr>","<hr />").html_safe #some kind of hack need to fix
	end
	
	def body_end(&block)
		@body_end||=[]
		if block_given?
			@body_end<<capture(&block)
		else
			@body_end.join.html_safe
		end
	end
#system info helpers	
	def system_info
		Rails.cache.fetch("system-info_#{$hostname}", expires_in: 15.days) {"#{`phoronix-test-suite system-info`.gsub(/(?<word>\w+):\n/,'</ul><li>\k<word>:<ul><li>').gsub(/(?<bold>[- \w]+:)/,'<b>\k<bold></b>').sub(/([\n].*)*mation/,"<ul style='margin-top:0;margin-bottom:0;'>").sub("</ul>","").gsub(",","</li><li>")}</li></ul></ul>" rescue "<p>failed to get system info</p>"}.html_safe
	end
	
	def uptime
		Rails.cache.fetch("uptime_#{$hostname}", expires_in: 1.minutes) {"<span style='margin-left: 15px;'>#{`uptime` rescue "<p>failed to get load average</p>"}</span>"}.html_safe
	end
	
	def hostname
		Rails.cache.fetch("hostname_#{$hostname}") {"<span style='margin-left: 15px;'>#{`hostname` rescue "<p>failed to get hostname</p>"}</span>"}.html_safe
	end
	
	def ifconfig
		style='margin-top:0;margin-bottom:0;'
		Rails.cache.fetch("ifconfig_#{$hostname}", expires_in: 5.minutes) {"<ul style=#{style}>#{`ifconfig`.split("\n\n").map!{|m| "#{m.gsub(/(?<w1>\w+) (?<w2>([abpR].|en|MU|BR))/,'\k<w1>_\k<w2>').gsub(/ (?<b>[MGKTP]?B)\)/,'\k<b>)').sub("HWaddr " ,"HWaddr:").sub(" TX_by","\nTX_by").gsub(": ",":").sub(" Link","\nLink").split("\n").map!{|l| "#{l.split(" ").map!{|w|  "<li>#{w.sub(":",": ").sub(/\A(?<bold>[- \w]+:?)/,'<b>\k<bold></b>')}</li>"}.join.sub("</li>","</li><ul style=#{style}>")}</ul>"}.join.sub("</li>","</li><ul style=#{style}>")}</ul>" if (m["inet addr"] && !m["lo"])}.compact.join }</ul>" rescue "<p>failed to get network info</p>"}.html_safe #"<span style='margin-left: 15px;'>"
	end
end
