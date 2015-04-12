class Form
  include Mongoid::Document

  field :name, :type => String
  field :token, :type => String
  field :location, :type => Hash
end
