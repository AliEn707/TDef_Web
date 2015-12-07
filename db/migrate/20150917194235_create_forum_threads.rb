class CreateForumThreads < ActiveRecord::Migration
  def change
    create_table :forum_threads do |t|
      t.string :name
      t.text :description
      t.integer :user_id
      t.boolean :closed, default: false
      t.integer :forum_id

      t.timestamps
    end
    add_index :forum_threads, :id, :unique => true
    add_index :forum_threads, :user_id
    add_index :forum_threads, :forum_id
  end
end
