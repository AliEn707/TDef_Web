module Tdef::Type::NpcsHelper
	def npc_type_textures
		Tdef::Type::Npc::TEXTURES
	end
	
	def npc_type_texture_params
		Tdef::Type::Npc::TEXTURE_PARAMS
	end
	
	def npc_type_params
		Tdef::Type::Npc::PARAMS
	end
	
	def grid_class(f)
		if (f) then
			"uk-width-1-1 uk-width-xlarge-1-2 uk-width-xxlarge-1-3"
		else
			"uk-width-1-1 uk-width-small-1-2 uk-width-medium-1-3 uk-width-large-1-4 uk-width-xlarge-1-5 uk-width-xxlarge-1-6"
		end
	end
end
