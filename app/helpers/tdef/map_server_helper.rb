module Tdef::MapServerHelper
	def server_columns
		[:host,:ctlport,:serv_num,:start_port].map!{|k| t("tdef.map_servers.#{k}")}
	end
end
