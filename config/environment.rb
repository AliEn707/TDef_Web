# Load the Rails application.
require File.expand_path('../application', __FILE__)

ENV['INLINEDIR'] =  "/tmp"  # for RubyInline

# Initialize the Rails application.
TDefWeb::Application.initialize!
