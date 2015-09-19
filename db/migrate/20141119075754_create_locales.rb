class CreateLocales < ActiveRecord::Migration
  def change
    create_table :tdef_locales do |t|
      t.string :name

      t.timestamps
    end
    add_index :tdef_locales, :id, :unique => true
    add_index :tdef_locales, :name, :unique => true
  end
end
