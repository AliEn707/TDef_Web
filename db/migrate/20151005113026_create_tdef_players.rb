class CreateTdefPlayers < ActiveRecord::Migration
  def change
    create_table :tdef_players do |t|
      t.text :properties
			
      t.integer :user_id
			
      t.timestamps
    end
  end
end
