class MapNode
	attr_accessor :id, :buildable, :walkable
	def initialize
	end
	
end

class Base
	attr_accssor :position, :type, :id
end

class Map
	attr_accessor :map, :size, :name, :scenario, :bases
	def initialize
	end
	
	def load(path)
	end
	
	def save
	end
end

class MapController < ApplicationController
	before_action :authenticate_user!
  def map_edit
  end
end
