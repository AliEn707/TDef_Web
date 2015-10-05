class CreateTdefPlayerAuths < ActiveRecord::Migration
  def change
    create_table :tdef_player_auths do |t|
      t.text :properties
      t.integer :token
			
      t.integer :player_id
			
      t.timestamps
    end
  end
end
