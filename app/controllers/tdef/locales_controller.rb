class Tdef::LocalesController < ApplicationController
	before_action :authenticate_user!
	before_action :is_admin?, except: [:get]
	def show_all
	  @locales=Tdef::Locale.order(:created_at)
	end
	def edit
		@a=request.POST
		h_h={}
		if request.post? then
			if !request.POST['name'].nil? 
				request.POST['name'].each_index do |i_i|
					name=request.POST['name'][i_i]
					h_h[name]=Tdef::Locale.where(name: name).first if h_h[name].nil?
					if !h_h[name].nil? then
						key=request.POST['key'][i_i]
						value=request.POST['value'][i_i]
						if  (key!="" && name!="" && value!="")
							locale=Tdef::LocaleData.where(key: key, locale_id: h_h[name].id).first
							if !locale.nil? then
								locale.value=value;
								locale.user_id=current_user.id;
								h_h[name].locale_datas<<locale
							end
						end
					end
				end
			end
		end

		redirect_to :back
	end
	
	def get
		data=Rails.cache.fetch("tdef_locale/#{@locale}",expires_in: 6.hours){"var locales=#{Locale.where(name:@locale).first.locale_datas.inject({}){|o,c| o.merge({c.key=>c.value})}.to_json};"}
		send_data(data, type: "text/javascript; charset=utf-8", filename: "locale_#{@locale}.js", disposition:'inline')	
	end
end
