require 'digest/md5'
require 'zlib'

module Devise
  module Encryptable
    module Encryptors  
      class Md5 < Base
        def self.digest(password, stretches, salt, pepper)
          str = [password, Zlib.crc32(salt).to_s].flatten.compact.join
          Digest::MD5.hexdigest(str)
        end
      end
    end
  end
end