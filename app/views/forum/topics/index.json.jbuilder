json.array!(@forum_topics) do |forum_topic|
  json.extract! forum_topic, :id, :name, :description, :user_id, :closed, :topicable_id, :topicable_type
  json.url forum_topic_url(forum_topic, format: :json)
end
