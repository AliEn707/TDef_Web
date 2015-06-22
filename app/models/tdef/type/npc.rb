require 'type_params_serializer'
require 'type_textures_container'

class Tdef::Type::Npc < ActiveRecord::Base
	serialize :params, TypeParamsSerializer
	serialize :textures, TypeTexturesSerializer

	before_save :bsave
	after_initialize :aload

	private
	
	def aload
		params["textures"]=textures #|| TypeTexturesContainer.new
=begin
		if (!textures) then
			["walk","attack"].each do |k1|
				params["textures"][k1]||={}
				["up","leftup","left","leftdown","down","rightdown","right","rightup"].each do |k2|				
					params["textures"][k1][k2]=nil
				end
			end
			["walk","attack","idle"].each do |k|
				params["textures"][k]=nil
			end
		end
=end
	end

	def bsave
		self.textures=params["textures"]
	end
end
