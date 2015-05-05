
#git reset --hard 
git pull
bundle install
rake db:migrate db:seed 
rake assets:precompile
rails_server restart