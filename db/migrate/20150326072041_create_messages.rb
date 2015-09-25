class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
	t.integer :user_id
	t.integer :msg_dest_id
	t.string :msg_dest_type
	
	t.string :data
	
	t.timestamps
    end
    
    add_index :messages, :user_id
    add_index :messages, [:msg_dest_id, :msg_dest_type]
    if (connection.adapter_name.downcase=="postgresql") then
#      execute "CREATE EXTENSION pg_trgm;" 
#      execute "CREATE EXTENSION btree_gist;" 
      execute "CREATE INDEX index_messages_on_data_and_msg_dest_type ON messages USING gist (msg_dest_type, data gist_trgm_ops);"
    end

  end
end
