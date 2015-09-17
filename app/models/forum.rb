class Forum < ActiveRecord::Base
  def self.table_name_prefix
    'forum_'
  end
end
