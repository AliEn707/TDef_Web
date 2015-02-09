class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.text :data
      t.string :format
      
      t.timestamps
    end
  end
end
