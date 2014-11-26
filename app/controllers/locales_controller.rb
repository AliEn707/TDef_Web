class LocalesController < ApplicationController
	before_action :authenticate_user!
	def show_all
	  @locales=Locale.all
	end
	def edit
		@a=request.POST
		h_h={}
		if request.post? then
			if !request.POST['delname'].nil? 
				delete=request.POST['delkey']
				name=request.POST['delname']
				delete.size.times do |i_i|
					h_h[name[i_i]]=Locale.find_by(name: name[i_i]) if h_h[name[i_i]].nil?
					next if h_h[name[i_i]].nil?
					d_d=LocaleData.find_by(key: delete[i_i], locale_id: h_h[name[i_i]].id)
					d_d.delete if !d_d.nil?
				end
			end
			if !request.POST['name'].nil? 
				request.POST['name'].size.times do |i_i|
					name=request.POST['name'][i_i]
					key=request.POST['key'][i_i]
					value=request.POST['value'][i_i]
					h_h[name]=Locale.find_by(name: name) if h_h[name].nil?
					h_h[name]=Locale.create(name: name) if h_h[name].nil?
					locale=LocaleData.find_by(key: key, locale_id: h_h[name].id)
					locale=LocaleData.create(key: key) if locale.nil?
					locale.value=value
					
					h_h[name].locale_datas<<locale
				end
			end
		end
		h_h.each do |k,v|
#			v.write_file
		end
		redirect_to locales_all_path
	end
end
