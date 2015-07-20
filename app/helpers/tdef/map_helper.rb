module Tdef::MapHelper

	def map_columns
		[:preview, :name, :ready, :description].map!{|k| t("tdef.maps.#{k}")}
	end
end
