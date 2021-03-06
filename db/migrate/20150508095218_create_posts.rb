class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.string :lang
      t.text :description, default: ""
      t.integer :user_id

      t.timestamps
    end
        add_index :posts, :user_id
  end
end
