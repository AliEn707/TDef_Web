# Load the Rails application.
require File.expand_path('../application', __FILE__)

ENV['INLINEDIR'] =  ENV["TMP"] || "/tmp"  # for RubyInline

# Initialize the Rails application.
TDefWeb::Application.initialize!
