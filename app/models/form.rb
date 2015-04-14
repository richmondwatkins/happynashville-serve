class Form
  include Mongoid::Document

  field :location, :type => Hash
end
