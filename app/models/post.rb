class Post < ActiveRecord::Base
	belongs_to :user, touch: true
	has_many :translations, class_name: "Post::Translation", dependent: :destroy
	has_many :images, as: :imageable, dependent: :destroy
	
	IMAGE_DIMENTIONS={width:800, method: "max"}
	
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
	
	def add_translations
		($available_locales-[lang]-self.translations.select(:lang).map{|t| t.lang}).each do |l|
			self.translations<<Post::Translation.create(
				title: $translator.translate(title, to: l),
				description: $translator.translate(description, to: l)+'<br /><a href="http://translate.yandex.ru">«Переведено сервисом «Яндекс.Переводчик»</a>',
				user: user,
				lang: l,
				post: self
			)
		end
	end
end

