#!/bin/sh
export RAILS_ENV=production

#git reset --hard 
git pull
bundle install --path .bundle
bundle update --path .bundle
bundle clean --path .bundle
rake db:migrate db:seed
rake assets:precompile
#add check for error and stop server if 
rails_server restart