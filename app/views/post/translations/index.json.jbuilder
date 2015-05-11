json.array!(@post_translations) do |post_translation|
  json.extract! post_translation, :id, :lang, :post_id, :title, :description
  json.url post_translation_url(post_translation, format: :json)
end
