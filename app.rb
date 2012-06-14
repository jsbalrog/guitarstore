require 'sinatra'
require 'mongoid'
require 'json'
require 'sinatra/reloader' if development?

Mongoid.load!("mongoid.yml")

class Guitar
  include Mongoid::Document
  
  field :make, type: String
  field :model, type: String
  field :year, type: String
  field :photo, type: String
end

get '/guitars.json' do
  content_type :json
  all_guitars = Guitar.all
  all_guitars.to_json
end
