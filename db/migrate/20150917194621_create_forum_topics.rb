class CreateForumTopics < ActiveRecord::Migration
  def change
    create_table :forum_topics do |t|
      t.string :name
      t.text :description
      t.integer :user_id
      t.boolean :closed
      t.integer :topicable_id
      t.string :topicable_type

      t.timestamps
    end
  end
end
