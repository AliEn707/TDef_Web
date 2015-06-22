class CreateTdefTypeNpcs < ActiveRecord::Migration
  def change
    create_table :tdef_type_npcs do |t|
      t.text :params
      t.text :textures

      t.timestamps
    end
  end
end
