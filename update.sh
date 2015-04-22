
export RAILS_ENV=production
#export RAILS_WEBSERV=thin
#export MEMSTORE_SIZE=512


git reset --hard 
git pull
bundle install
rake db:migrate db:seed assets:precompile
rails s
#service rails_server stop
#service rails_server start