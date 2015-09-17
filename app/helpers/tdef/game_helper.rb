module Tdef::GameHelper
	def javascript_types_npc
		"<script src='#{tdef_types_npc_path}'></script>".html_safe
	end
	
	def javascript_types_tower
		"<script src='#{tdef_types_tower_path}'></script>".html_safe
	end

	def javascript_locales
		"<script src='#{tdef_locale_get_path}'></script>".html_safe
	end

	def javascript_game_access
		"<script src='#{tdef_access_path}'></script>".html_safe
	end
	
	def javascript_game_init
		"<script src='#{tdef_init_path}'></script>".html_safe
	end
end
