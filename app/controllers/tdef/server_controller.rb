class Tdef::ServerController < ApplicationController
	before_action :authenticate_user!
	before_action :is_admin?
	def show
		if request.get?
			@servers=Server.all
		end
		if request.post?
			if !params['delhostname'].nil? then
				hostname=params['delhostname']
				port=params['delport']
				hostname.size.times do |i_i|
					d_d=Server.find_by(hostname: hostname[i_i], port: port[i_i])
					d_d.delete if !d_d.nil?
				end
			end
			if !params['hostname'].nil? then
				params['hostname'].size.times do |i_i|
					s_s=Server.find_by(hostname: params['hostname'][i_i], port: params['port'][i_i])
					s_s=Server.create(hostname: params['hostname'][i_i], port: params['port'][i_i]) if s_s.nil?
					s_s.rooms=params['rooms'][i_i]
					s_s.startport=params['startport'][i_i]
					s_s.save
				end
			end
			redirect_to tdef_server_all_path
		end
	end
	
	def info
		params['id']
	end
end
