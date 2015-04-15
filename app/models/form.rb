class Form
  include Mongoid::Document

  # field :location, :type => Hash

  field :name, :type => Array

  field :slug, :type => String

  field :address, :type => String

  field :phoneNumber, :type => String

  field :website, :type => String

  field :dealDays, :type => Array

  field :coords, :type => Hash

  field :rating, :type => Double
  
end
