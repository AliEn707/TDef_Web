#!/bin/sh
export RAILS_ENV=production

#git reset --hard 
git pull
bundle install
rake db:migrate db:seed
rake assets:precompile
#add check for error and stop server if 
rails_server restart