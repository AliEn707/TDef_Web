class CreateForums < ActiveRecord::Migration
  def change
    create_table :forums do |t|
      t.string :name
      t.text :description
      t.integer :user_id
      t.boolean :closed, default: false
	  t.string :locale
	  
      t.timestamps
    end
    add_index :forums, :id, :unique => true
    add_index :forums, :user_id
  end
end
