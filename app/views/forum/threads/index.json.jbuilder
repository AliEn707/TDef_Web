json.array!(@forum_threads) do |forum_thread|
  json.extract! forum_thread, :id, :name, :description, :user_id, :closed, :forum_id
  json.url forum_thread_url(forum_thread, format: :json)
end
