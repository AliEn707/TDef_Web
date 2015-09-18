class Post::Translation < ActiveRecord::Base
	belongs_to :post, touch: true
	belongs_to :user
	has_many :images, as: :imageable, dependent: :destroy
	
	IMAGE_DIMENTIONS={width:800, method: "max"}
	
	def creation_date
		Post.select(:created_at).where(id: self.post_id).first.created_at
#		post.created_at
	end
end
