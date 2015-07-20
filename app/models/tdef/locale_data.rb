class Tdef::LocaleData < ActiveRecord::Base
	belongs_to :locale
	belongs_to :user, touch: true
end
