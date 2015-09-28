class Tdef::Locale::Data < ActiveRecord::Base
  belongs_to :locale
  belongs_to :user, touch: true
  
  def self.table_name
    Tdef::Locale.table_name_prefix+"data"
  end
end
