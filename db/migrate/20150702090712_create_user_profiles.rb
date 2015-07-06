class CreateUserProfiles < ActiveRecord::Migration
  def change
    create_table :user_profiles do |t|
      t.text :properties, :default => "{}"
      t.integer :user_id

      t.timestamps
    end
  end
end
