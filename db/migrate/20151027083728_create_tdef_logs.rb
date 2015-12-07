class CreateTdefLogs < ActiveRecord::Migration
  def change
    create_table :tdef_logs do |t|
      t.string :action
      t.integer :player_id
      t.integer :logable_id
      t.string :logable_type
      t.integer :value
      t.text :other

      t.timestamps
    end
    add_index :tdef_logs, :action
    add_index :tdef_logs, :player_id
    add_index :tdef_logs, [:logable_id, :logable_type]
    add_index :tdef_logs, [:action, :player_id]
    add_index :tdef_logs, [:action, :logable_id, :logable_type]
  end
end
