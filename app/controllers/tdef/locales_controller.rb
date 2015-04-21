class Tdef::LocalesController < ApplicationController
	before_action :authenticate_user!
	before_action :is_admin?
	def show_all
	  @locales=Tdef::Locale.all
	end
	def edit
		@a=request.POST
		h_h={}
		if request.post? then
			if !request.POST['delname'].nil? 
				delete=request.POST['delkey']
				name=request.POST['delname']
				delete.each_index do |i_i|
					d_d=Tdef::LocaleData.joins(:locale).where('"locales"."name" = "'+name[i_i].to_s+'"').find_by(key: delete[i_i])
					d_d.delete if !d_d.nil?
				end
			end
			if !request.POST['name'].nil? 
				request.POST['name'].each_index do |i_i|
					name=request.POST['name'][i_i]
					key=request.POST['key'][i_i]
					value=request.POST['value'][i_i]
					if  (key!="" && name!="" && value!="")
						h_h[name]=Tdef::Locale.find_by(name: name) if h_h[name].nil?
						h_h[name]=Tdef::Locale.create(name: name) if h_h[name].nil?
						locale=Tdef::LocaleData.where(key: key, locale_id: h_h[name].id).first
						locale=Tdef::LocaleData.create(key: key, accepted: true) if locale.nil?
						locale.value=value;
						locale.user_id=current_user.id;
						h_h[name].locale_datas<<locale
					end
				end
			end
		end

		redirect_to :back
	end
	def remove
		key=:alert
		value=t(:locale_not_found)
		if (!params["name"].nil?) then
			l=Tdef::Locale.where(name: params["name"]).first
			if (!l.nil?) then
				l.locale_datas.each{|ld| ld.destroy}
				l.destroy
				key=:notice
				value=t(:locale_deleted)
			end
		end
		redirect_to :back, key=> value
	end
end
