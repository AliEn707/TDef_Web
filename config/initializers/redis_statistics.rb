$redis_statistics=nil
if (ENV['REDIS_STATISTICS_HOST'] || ENV['REDIS_STATISTICS_PORT'])
	$redis_statistics=Redis.new(:host => (ENV['REDIS_STATISTICS_HOST'] || "localhost"), :port => (ENV['REDIS_STATISTICS_PORT'] || 6379).to_i, :db => 0)
	$redis_statistics.hset "redis_statistics/requests", `hostname`, 0
	$redis_statistics.hset "redis_statistics/time", `hostname`, Time.now.to_i
end