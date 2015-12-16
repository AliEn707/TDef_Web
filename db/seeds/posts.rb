 Post.all.each do |p|
	p.add_translations.each do |l|
		puts "added translation #{l} for post '#{p.title}'"
	end
end