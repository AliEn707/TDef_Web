class User::Role < ActiveRecord::Base #permissions for user
	belongs_to :user, touch: true
	serialize :accept, JSON
	
	after_initialize :set_defaults, :if => :new_record?
	
	private
	
	def set_defaults
		self.accept['forum']=true
	end
end
