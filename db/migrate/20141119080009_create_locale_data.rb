class CreateLocaleData < ActiveRecord::Migration
  def change
    create_table :tdef_locale_data do |t|
      t.string :key
      t.string :value
      t.integer :locale_id
      t.integer :user_id
      
      t.timestamps
    end
    add_index :tdef_locale_data, :locale_id
    add_index :tdef_locale_data, :user_id
  end
end
