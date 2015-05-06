class CreateMapServers < ActiveRecord::Migration
  def change
    create_table :map_servers do |t|
      t.string :hostname
      t.integer :port
      t.integer :rooms
      t.integer :startport

      t.timestamps
    end
  end
end
