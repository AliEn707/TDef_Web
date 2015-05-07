#!/bin/sh
export RAILS_ENV=production

#git reset --hard 
git pull
bundle install --path .bundle
bundle update 
bundle clean 
bundle exec rake db:migrate db:seed
bundle exec rake assets:precompile
#add check for error and stop server if 
rails_server restart