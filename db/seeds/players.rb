#set missed players
User.all.each do |p|
	p.player=Tdef::Player.create(user: p)	if (p.player.nil?) # set Tdef::Player
	p.player.auth=Tdef::Player.create(player: p.player) if (p.player.auth.nil?) #set Tdef::Player::Auth
end
