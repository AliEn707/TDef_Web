class AddWritedToMaps < ActiveRecord::Migration
  def change
    add_column :maps, :writed, :boolean
  end
end
