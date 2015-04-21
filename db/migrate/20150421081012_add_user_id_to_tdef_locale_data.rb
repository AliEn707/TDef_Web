class AddUserIdToTdefLocaleData < ActiveRecord::Migration
  def change
	   add_column :locale_data, :user_id, :integer
	   add_column :locale_data, :accepted, :boolean
  end
end
