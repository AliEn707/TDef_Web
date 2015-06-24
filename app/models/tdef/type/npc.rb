require 'type_params_serializer'
require 'type_textures_container'

class Tdef::Type::Npc < ActiveRecord::Base
	serialize :params, TypeParamsSerializer
	serialize :textures, TypeTexturesSerializer
	after_initialize :aload
	before_destroy :clean
	
	PARAMS=["health",
			"speed",
			"damage",
			"shield",
			"see_distanse",
			"attack_speed",
			"move_speed",
			"cost",
			"receive",
			"bullet_type"
			]
	TEXTURES=["idle","destroy","walk","attack"].inject([]) do |o,k1|
				o+=["up","leftup","left","leftdown","down","rightdown","right","rightup"].map! do |k2|
					"#{k1}_#{k2}"
				end<<k1
			end
			
	TEXTURE_PARAMS=["frames","height","width"]
	
	private
	
	def aload
		self.textures ||= TypeTexturesContainer.new
	end
	
	def clean
		self.textures.clean!
	end
end
