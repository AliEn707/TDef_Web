class Tdef::LocaleData < ActiveRecord::Base
	belongs_to :locale, touch: true
	belongs_to :user, touch: true
end
