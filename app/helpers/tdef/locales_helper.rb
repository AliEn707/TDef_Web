module Tdef::LocalesHelper
	def locale_columns
		[:locale,:key,:value].map!{|k| t("tdef.locales.#{k}")}
	end
end
