#set missed roles
User.all.each do |p|
	p.role=User::Role.create(user: p)	if (p.role.nil?) # set User::Role
end
