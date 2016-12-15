require 'sinatra/base'
require 'sinatra/assetpack'

class CoditJack < Sinatra::Base
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack
  assets do
    serve '/js', from: 'app/js'
    serve '/css', from: 'app/css'
    serve '/images', from: 'app/images'
    js :application, [ '/js/jquery.min.js', '/js/*.js' ]
    css :application, [ '/css/pure-min.css', '/css/*.css' ]

    js_compression :jsmin
    css_compression :simple
  end

  set :bind, '0.0.0.0'
  get '/' do
    erb :index
  end
end
