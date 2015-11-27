class Tdef::Log < ActiveRecord::Base
	belongs_to :user
	belongs_to :logable, polymorphic: true
	
	ACTIONS=[
	'income', #- вход обьекта в систему (создание обьекта)
  'outcome', #- выход обьекта из сестемы (разрушение обьекта)
#  'take', #- получение обьекта от игрока
#  'give', #- отдача обьекта игроку
  'server', #- вход игрока на сервер
  'login' #- логин игрока
	]
end
