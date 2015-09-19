class CreateUserRoles < ActiveRecord::Migration
  def change
    create_table :user_roles do |t|
      t.text :acept, default: "[]"
      t.integer :user_id
	
      t.timestamps
    end
      add_index :user_roles, :id, :unique => true
      add_index :user_roles, :user_id
      execute "CREATE INDEX  index_user_roles_on_acept ON user_roles USING gist (acept gist_trgm_ops);" rescue 0
  end
end
