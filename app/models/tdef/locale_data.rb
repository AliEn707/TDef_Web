class Tdef::LocaleData < ActiveRecord::Base
	belongs_to :locale, touch: true
end
