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
  end
end
