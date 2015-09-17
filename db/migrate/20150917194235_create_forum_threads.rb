class CreateForumThreads < ActiveRecord::Migration
  def change
    create_table :forum_threads do |t|
      t.string :name
      t.text :description
      t.integer :user_id
      t.boolean :closed
      t.integer :forum_id

      t.timestamps
    end
  end
end
