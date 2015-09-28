class Tdef::Locale < ActiveRecord::Base
  has_many :locale_datas, class_name: "Tdef::Locale::Data"
	
  def self.table_name_prefix
    Tdef.table_name_prefix+'locale_'
  end
end
