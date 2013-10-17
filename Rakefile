require 'rake'
require 'sass'
require 'coffee-script'

task :default => [:compile]

task :compile do
	engine = Sass::Engine.new(File.read("sparehanger/sass/sparehanger.scss"), :syntax => :scss, :load_paths => ['sparehanger/sass'])
	File.write('sparehanger/compiled/sparehanger.css', engine.render)
	puts "sparehanger/sass/sparehanger.scss -> sparehanger/compiled/sparehanger.css"

	coffee = File.read('sparehanger/coffee/sparehanger.coffee');
	File.write('sparehanger/compiled/sparehanger.js', CoffeeScript.compile(coffee))
	puts "sparehanger/coffee/sparehanger.coffee -> sparehanger/compiled/sparehanger.js"
end
