class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
	t.string :name
	t.text :data
	t.text :grafics
	t.integer :players
	t.boolean :completed
	t.timestamps
    end
  add_index :maps, :name
  end
end
