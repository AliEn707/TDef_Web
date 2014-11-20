class CreateClientUpdates < ActiveRecord::Migration
  def change
    create_table :client_updates do |t|
      t.integer :status

      t.timestamps
    end
  end
end
