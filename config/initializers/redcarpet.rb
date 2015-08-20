$markdown = Redcarpet::Markdown.new(
	Redcarpet::Render::HTML.new(
#		hard_wrap: true
	),
	autolink: true, 
	tables: true, 
	space_after_headers: true, 
	strikethrough: true, 
	quote: true, 
	underline: true
)