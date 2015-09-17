json.array!(@forums) do |forum|
  json.extract! forum, :id, :name, :description, :user_id, :closed
  json.url forum_url(forum, format: :json)
end
