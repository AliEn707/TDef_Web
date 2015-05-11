class Post < ActiveRecord::Base
	belongs_to :user, touch: true
	has_many :translations, class_name: "Post::Translation"
	
	def translation_by_lang(lang)
		#return if current lang matched
		return self if (self.lang==lang)
		#try to find selected lang
		post=self.translations.where(lang: lang).first
		#return if find one
		return post if (!post.nil?)
		#try "en" lang
		return self if (self.lang=="en")
		post=self.translations.where(lang: lang).first if (post.nil? || post.lang!="en")
		return post if (!post.nil?)
		self
	end
	
	def creation_date
		created_at
	end
end

