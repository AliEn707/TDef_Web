class CreateTempClientFiles < ActiveRecord::Migration
	#temp table with changes in files that not applied
  def change
    create_table :temp_client_files do |t|
      t.string :path

      t.timestamps
    end
  end
end
