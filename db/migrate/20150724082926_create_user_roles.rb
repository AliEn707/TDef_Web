class CreateUserRoles < ActiveRecord::Migration
  def change
    create_table :user_roles do |t|
      t.text :acept, default: "[]"
      t.integer :user_id
	
      t.timestamps
    end
      add_index :user_roles, :user_id
  end
end
