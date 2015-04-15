
export RAILS_ENV=production
#export RAILS_WEBSERV=thin
#export MEMSTORE_SIZE=512

#service rails_server stop
git reset --hard 
git pull
bundle install
rake db:migrate assets:precompile
rails s
#service rails_server start