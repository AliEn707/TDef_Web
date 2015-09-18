require 'type_params_serializer'
require 'type_textures_container'

class Tdef::Type::Tower < ActiveRecord::Base
	serialize :params, TypeParamsSerializer
	serialize :textures, TypeTexturesSerializer
	after_initialize :aload
	before_destroy :clean
	
	PARAMS={"name" => "text_field",
			"health" => "text_field",
			"speed" => "text_field",
			"damage" => "text_field",
			"shield" => "text_field",
			"see_distanse" => "text_field",
			"attack_speed" => "text_field",
			"cost" => "text_field",
			"receive" => "text_field",
			"bullet_type" => "text_field"
			}
	TEXTURES=["idle","destroy","attack"].inject([]) do |o,k1|
				o+=["up","leftup","left","leftdown","down","rightdown","right","rightup"].map! do |k2|
					"#{k1}_#{k2}"
				end<<k1
			end
			
	TEXTURE_PARAMS=["frames","height","width"]

	def set_textures(t)
		return if !t
		images=[]
		t.each do |k1,v1|
			if (!v1["img"].blank?) then
				self.textures.remove(k1) if (self.textures[k1] && self.textures[k1].id!=v1["img"].to_i)
				self.textures[k1]=Image.find(v1["img"]) if (!self.textures[k1])
				images<<v1["img"].to_i
				v1.each do |k2,v2|
					self.textures.attr(k1,k2,(!v2[/[\+\-]?\d+(\.\d+)?/].nil?) ? (v2["."].nil? ? v2.to_i : v2.to_f) : v2) if (k2!="img" && !v2.blank?)
				end
			else
				self.textures.remove(k1)  if self.textures[k1]
			end
		end
		#remove textures that is not used
		Image.where(imageable: self).each {|i| i.destroy if (!images.include?(i.id)) }
	end
	
	private
	
	def aload
		self.textures ||= TypeTexturesContainer.new
	end
	
	def clean
		self.textures.clean!
	end
end
