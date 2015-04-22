class AddDescriptionToMaps < ActiveRecord::Migration
  def change
	  add_column :maps, :description, :text
	  add_column :maps, :user_id, :integer
	  add_column :maps, :last_modified_id, :integer
  end
end
