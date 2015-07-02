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
	
	def for_admin
		yield if (!current_user.nil? && current_user.admin)
	end
	
	def menu 
		a=[]
		if !current_user.nil?
			a<<[{'name'=>current_user.email.to_s,'right'=>true},
					{'name'=>t(:edit_registration),'path' => edit_user_registration_path},
					{'name'=>t(:sign_out),'path'=>destroy_user_session_path,:method => :delete}]
			tdef=[{'name'=>t(:tdef)},
					{'name'=>t(:game),'path'=>tdef_game_path},
				]
			social=[{'name'=>t(:social)},
					{'name'=>t(:profile),'path'=>user_profile_path(current_user.profile)},
#					{'name'=>t(:search),'path'=>search_path},
					{'name'=>t(:friends),'path'=>friends_path},
					{'name'=>t(:messages),'path'=>messages_path},
					{'name'=>t(:news),'path'=>posts_path}]
			if (current_user.admin) then
				tdef+=[
					{'name'=>t(:map_editor),'path'=>tdef_map_edit_path},
					{'name'=>t(:maps),'path'=>tdef_map_all_path},
					{'name'=>t(:servers),'path'=>tdef_server_all_path},
					{'name'=>t(:locales),'path'=>tdef_locales_all_path},
					{'name'=>t(:npc_types),'path'=>tdef_type_npcs_path},
					{'name'=>t(:tower_types),'path'=>tdef_type_towers_path},
					{'name'=>t(:flash_test),'path'=>"/ExternalInterfaceExample.html"},
					{'name'=>t(:audio_test),'path'=>"/audiotest.html"}
				]
			end
			a<<tdef
			a<<social
#			a<<{'name'=>Dir[Rails.root.join('locales', '*.{rb,yml}').to_s],'path'=>'#'}
		else
			a<<[{'name'=>t(:sign_in), 'path'=> new_user_session_path, 'show'=>true}]
			a<<[{'name' => t(:sign_up) , 'path' => new_user_registration_path}]			
		end
		locale=[]
		locale<<{'name'=>current_locale,'right'=>true, 'show'=>true}
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
	
	def cache_lang_admin
		"#{current_user.locale}_#{current_user.admin}" rescue  cookies[:locale]
	end
	
	def markdown(text)
#		Redcarpet::Render::SmartyPants.render(
		$markdown.render(text.to_s).html_safe
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
		Rails.cache.fetch('system-info') {"#{`phoronix-test-suite system-info`.gsub(/(?<word>\w+):\n/,'</ul><li>\k<word>:<ul><li>').gsub(/(?<bold>[- \w]+:)/,'<b>\k<bold></b>').sub(/([\n].*)*mation/,"<ul style='margin-top:0;margin-bottom:0;'>").sub("</ul>","").gsub(",","</li><li>")}</li></ul></ul>".html_safe || "failed to get system info"}
	end
	
	def uptime
		Rails.cache.fetch('uptime',expires_in: 1.minutes) {"<span style='margin-left: 15px;'>#{`uptime` || "failed to get load average"}</span>".html_safe}
	end
	
	def hostname
		Rails.cache.fetch('hostname',expires_in: 1.hours) {"<span style='margin-left: 15px;'>#{`hostname` || "failed to get hostname"}</span>".html_safe}
	end
	
	def ifconfig
		style='margin-top:0;margin-bottom:0;'
		Rails.cache.fetch('ifconfig',expires_in: 5.minutes) {"<ul style=#{style}>#{`ifconfig`.split("\n\n").map!{|m| "#{m.gsub(/(?<w1>\w+) (?<w2>([abpR].|en|MU|BR))/,'\k<w1>_\k<w2>').gsub(/ (?<b>[MGKTP]?B)\)/,'\k<b>)').sub("HWaddr " ,"HWaddr:").sub(" TX_by","\nTX_by").gsub(": ",":").sub(" Link","\nLink").split("\n").map!{|l| "#{l.split(" ").map!{|w|  "<li>#{w.sub(":",": ").sub(/\A(?<bold>[- \w]+:?)/,'<b>\k<bold></b>')}</li>"}.join.sub("</li>","</li><ul style=#{style}>")}</ul>"}.join.sub("</li>","</li><ul style=#{style}>")}</ul>" if (m["inet addr"] && !m["lo"])}.compact.join }</ul>".html_safe || "failed to get network info"} #"<span style='margin-left: 15px;'>"
	end
end
