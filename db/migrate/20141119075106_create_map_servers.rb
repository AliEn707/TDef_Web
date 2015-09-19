class CreateMapServers < ActiveRecord::Migration
  def change
    create_table :tdef_map_servers do |t|
      t.string :hostname
      t.integer :port
      t.integer :rooms
      t.integer :startport

      t.timestamps
    end
    add_index :tdef_map_servers, :id, :unique => true
    add_index :tdef_map_servers, [:hostname, :port]
  end
end
