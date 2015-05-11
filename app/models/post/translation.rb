class Post::Translation < ActiveRecord::Base
	belongs_to :post, touch: true
	belongs_to :user, touch: true
	
	def creation_date
		Post.select(:created_at).where(id: self.post_id).first.created_at
#		post.created_at
	end
end
