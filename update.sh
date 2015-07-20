#!/bin/bash
#export RAILS_ENV=production

echo -e "\n\n"
hostname
echo -e "\n\n"

git reset --hard 
git pull
#bundle install --path .bundle
bundle update 
bundle clean 
if [[ -n UPDATE_DB ]]; then
	bundle exec rake db:migrate db:seed
fi

if [[ -n COMPILE_ASSETS ]]; then
	bundle exec rake tmp:cache:clear
	bundle exec rake assets:precompile
fi
#add check for error and stop server if 
rails_server restart