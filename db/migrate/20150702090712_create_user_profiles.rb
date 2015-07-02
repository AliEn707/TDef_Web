class CreateUserProfiles < ActiveRecord::Migration
  def change
    create_table :user_profiles do |t|
      t.text :properties
      t.integer :user_id
      t.date :birthday

      t.timestamps
    end
  end
end
