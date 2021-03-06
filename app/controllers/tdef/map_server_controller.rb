class Tdef::MapServerController < ApplicationController
	before_action :authenticate_user!, except: [:get]
	before_action :is_admin?, except: [:get]
	def show
		if request.get?
			@servers=Tdef::MapServer.all.order(created_at: :desc)
		end
		if request.post?
			if !params['delhostname'].nil? then
				hostname=params['delhostname']
				port=params['delport']
				hostname.each_index do |i_i|
					d_d=Tdef::MapServer.find_by(hostname: hostname[i_i], port: port[i_i])
					d_d.delete if !d_d.nil?
				end
			end
			if !params['hostname'].nil? then
				params['hostname'].each_index do |i_i|
					if (params['hostname'][i_i]!="" && params['port'][i_i].to_i!=0) then
						s_s=Tdef::MapServer.find_by(hostname: params['hostname'][i_i], port: params['port'][i_i].to_i)
						s_s=Tdef::MapServer.create(hostname: params['hostname'][i_i], port: params['port'][i_i].to_i) if s_s.nil?
						s_s.rooms=params['rooms'][i_i].to_i
						s_s.startport=s_s.port+1;
						s_s.save
					end
				end
			end
			redirect_to tdef_mapserver_all_path
		end
	end
	
	def info
		params['id']
	end
end
