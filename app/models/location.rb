class Location
  include Mongoid::Document
  field :location, :type => Hash
end
