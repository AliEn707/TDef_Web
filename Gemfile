source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.0.2'

gem 'active_record_union'

# Use sqlite3 as the database for Active Record
gem 'sqlite3', group: :development

gem "pg", group: :production

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.0'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

#compressor
#gem 'htmlcompressor'

# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.0.0'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
#gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

#file uploads
gem 'remotipart', '~> 1.2'
#copy to clipboard
gem 'zeroclipboard-rails', "0.1.0"
#js routes
gem "js-routes"

# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
#gem 'turbolinks'

gem "sprockets-rails"

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 1.2'

#for generate js from ruby
#//= require opal
#//= require opal_ujs
#gem 'opal-rails'

#fast json serializer
gem 'oj', "2.12.14", platforms: :mri
gem 'oj_mimic_json', "1.0.1", platforms: :mri

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

# Use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.1.2'

#gem 'to_xls-rails'

# Use Capistrano for deployment
#group :development do
#	gem 'capistrano'
#	gem 'capistrano-rails'
#	gem 'capistrano-bundler'
#	gem 'capistrano-rvm'
#end

#creating simple forms
gem 'simple_form'

#For MarkDown in posts
gem 'redcarpet', "3.2.3"

#for html truncate
gem "nokogiri"
gem "htmlentities"


# Use debugger
# gem 'debugger', group: [:development, :test]

gem 'rack-mini-profiler', group: :development

gem "twitter-bootstrap-rails"

gem "devise", "3.2.4"
gem "recaptcha", require: "recaptcha/rails"

gem "mail"


#for sending mails with log
gem 'logging-rails', :require => 'logging/rails'
gem 'logging-email', require: 'logging'

#for delayed jobs
#rails generate delayed_job:active_record
#gem 'delayed_job_active_record'

gem 'rails-i18n' , "4.0.3"

#gem 'webrick', '1.3.1', group: :development

#for creating png
gem 'chunky_png' , '1.3.3'

gem 'rqrcode', "0.4.2"

#compressor
#gem "ruby-lzma"

if (!ENV['REDIS_HOST'].nil? || !ENV['REDIS_PORT'].nil?)
	#redis included only if used
	gem 'redis-rails'
end

#for use C code in ruby
gem 'RubyInline'	

#for resising images
#ubuntu sudo apt-get install libgd2-noxpm-dev
#win https://yadi.sk/d/6vQXSedajK4oa
gem 'fastimage_resize' , :git => 'https://github.com/AliEn707/fastimage_resize.git'
	
if RUBY_PLATFORM=~ /mingw/ 
	#only win
	
#	gem "thin" #strange but not work on win, must use webrick
else
	#fast webserver
	if (ENV["RAILS_WEBSERV"]=="thin") then
		gem "thin"
	elsif (ENV["RAILS_WEBSERV"]=="unicorn") then
		gem 'unicorn-rails'
	elsif (ENV["RAILS_WEBSERV"]=="webrick") then
		gem 'webrick'
	elsif (ENV["RAILS_WEBSERV"]=="rainbows") then
		gem 'rainbows-rails'
	else
		gem 'puma'
	end	
end

#creating dump of the base as seed.rb file
gem 'seed_dump'
