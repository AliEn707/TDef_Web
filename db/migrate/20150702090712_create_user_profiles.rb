class CreateUserProfiles < ActiveRecord::Migration
  def change
    create_table :user_profiles do |t|
      t.text :properties, default: "{}"
      t.integer :user_id

      t.timestamps
    end
    add_index :user_profiles, :user_id, :unique => true
#    execute "CREATE extension pg_trgm;" rescue 0
    execute "CREATE INDEX  index_user_profiles_on_properties ON user_profiles USING gist (properties gist_trgm_ops);" rescue 0
#    add_index :user_profiles, "properties", using: 'gist'
  end
end
