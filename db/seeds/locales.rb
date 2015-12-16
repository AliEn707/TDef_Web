# Lets set missed locales
keys={}
$available_locales.inject([]) do |o, l| #returns array of Tdef::Locales
  loc = (Tdef::Locale.where(name:l).first || Tdef::Locale.create(name:l))
  keys= if (l=='en') #get all different keys, en in priority 
    keys.merge(loc.locale_datas.inject({}){|h,d| h.merge(d.key=>d.value)})
  else
    loc.locale_datas.inject({}){|h,d| h.merge(d.key=>d.value)}.merge(keys)
  end
  o<< loc
end.each do |locale|
  {
		"#will_be_soon" => "Not implemented yet...",
		"#loading" => "Loading...",
		"#events_menu_button" => "Events",
		"#public_auth_fail" => "Authentication error.",
		"#mapserver_connecting" => "Connecting to map server...",
		"#public_connecting" => "Connecting to public server...",
		"#public_connect_fail" => "Can't connect to public server.",
		"#wait_connector" => "Connector loading...",
		"#check_flash" => "Check Adobe Flash Plugin on your browser.",
		"#connector_not_available" => "Can't init connector, see help for details."
	}.merge(keys).each do |k,v| #add required datas
    if (locale.locale_datas.where(key: k).first.nil?)	then
			locale.locale_datas<<Tdef::Locale::Data.create(key: k,value: $translator.translate(v, to: locale.name), user_id: 2)
			p "Tdef::Locale #{locale.name} added #{k}"
		end
	end
end
