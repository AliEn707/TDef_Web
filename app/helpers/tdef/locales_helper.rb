module Tdef::LocalesHelper
	def locale_columns
		[:locale,:tkey,:value].map!{|k| t("tdef.locales.#{k}")}
	end
end
