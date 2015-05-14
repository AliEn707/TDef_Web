class CreatePostTranslations < ActiveRecord::Migration
  def change
    create_table :post_translations do |t|
      t.string :lang
      t.integer :post_id
      t.integer :user_id
      t.string :title, default: ""
      t.text :description, default: ""

      t.timestamps
    end
    add_index :post_translations, [:lang, :post_id]
  end
end
