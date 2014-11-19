class CreateLocaleData < ActiveRecord::Migration
  def change
    create_table :locale_data do |t|
      t.string :key
      t.string :value
      t.integer :locale_id
	
      t.timestamps
    end
  end
end
