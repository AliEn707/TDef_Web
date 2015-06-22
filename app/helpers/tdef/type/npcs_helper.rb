module Tdef::Type::NpcsHelper
	def textures
		["idle","destroy","walk","attack"].inject([]) do |o,k1|
			o+=["up","leftup","left","leftdown","down","rightdown","right","rightup"].map! do |k2|
				"#{k1}_#{k2}"
			end<<k1
		end
	end
end
