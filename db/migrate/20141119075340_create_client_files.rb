class CreateClientFiles < ActiveRecord::Migration
  def change
    create_table :client_files do |t|
	t.string :path
	t.integer :timestamp
	t.integer :file_type
	
	t.timestamps
    end
  end
end
