require 'rake'
require 'sass'
require 'coffee-script'

task :default => [:compile]

task :compile do
	engine = Sass::Engine.new(File.read("framework/sass/sparehanger.scss"), :syntax => :scss, :load_paths => ['framework/sass'])
	File.write('framework/compiled/sparehanger.css', engine.render)
	puts "framework/sass/sparehanger.scss -> framework/compiled/sparehanger.css"
end
