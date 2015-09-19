class CreateMaps < ActiveRecord::Migration
  def change
    create_table :tdef_maps do |t|
	t.string :name
	t.text :data
	t.text :grafics
	t.text :description
	t.integer :players
	t.boolean :completed
	
	t.integer :user_id
	t.integer :last_modified_id
	t.timestamps
    end
    add_index :tdef_maps, :name, :unique => true
    add_index :tdef_maps, :id, :unique => true
    add_index :tdef_maps, :updated_at
    add_index :tdef_maps, :completed
  end
end
