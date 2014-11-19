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
locale.save

Locale.create(name:"ru")
Locale.create(name:"jp")