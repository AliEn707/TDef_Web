
$redis = nil

if (!ENV['REDIS_SOCKET'].nil?) then
	$redis=Redis.new(:path => ENV['REDIS_SOCKET'])
elsif(!ENV['REDIS_PORT'].nil?) then
	$redis=Redis.new(:host => 'localhost', :port => ENV['REDIS_PORT'].to_i) 
end
