class CreateUserProfiles < ActiveRecord::Migration
  def change
    create_table :user_profiles do |t|
      t.text :properties, default: "{}"
      t.integer :user_id

      t.timestamps
    end
    add_index :user_profiles, :user_id
    if (connection.adapter_name.downcase=="postgresql") then
#      execute "CREATE extension pg_trgm;" 
      execute "CREATE INDEX  index_user_profiles_on_properties ON user_profiles USING gist (properties gist_trgm_ops);"
    end
  end
end

