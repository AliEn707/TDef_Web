class Locale < ActiveRecord::Base
	has_many :locale_datas, dependent: :destroy
end
