class CreateTdefTypeTowers < ActiveRecord::Migration
  def change
    create_table :tdef_type_towers do |t|
	t.text :params
	t.text :textures

	t.timestamps
    end
  end
end
