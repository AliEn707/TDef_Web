# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

#test
locale=Locale.create(name:"en")
locale.locale_datas<<LocaleData.create(key:"#test1",value:"value of test key")
locale.locale_datas<<LocaleData.create(key:"#test2",value:"значение тестового ключа")
locale.locale_datas<<LocaleData.create(key:"#test3",value:"テストキーの値を")
locale.locale_datas<<LocaleData.create(key:"#test_map",value:"Начать test карту")
locale.save

Locale.create(name:"ru")
Locale.create(name:"jp")

u=User.create(email:'test@test.test', password:'000000', password_confirmation:'000000',confirmed_at: Time.now)
u.admin=true
u.save

Map.create(name: "test",data: "test map data file",grafics: "test map grafics file",icon: "ljf")
#u.save
#u.confirm!
#u.save