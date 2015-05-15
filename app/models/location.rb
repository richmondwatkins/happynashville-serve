class Location
  include Mongoid::Document

  Mongoid.raise_not_found_error = false

  field :name, :type => String

  field :slug, :type => String

  field :address, :type => String

  field :phoneNumber, :type => String

  field :website, :type => String

  field :isLocal, :type => Boolean

  field :dealDays, :type => Array

  field :coords, :type => Hash

  field :rating, :type => Integer

  field :priceLevel, :type => Integer
end
