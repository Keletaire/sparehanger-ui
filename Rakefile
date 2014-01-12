require 'rake'
require 'sass'

task :default => [:compile]

task :compile do
	engine = Sass::Engine.new(File.read("src/scss/sparehanger.scss"), :syntax => :scss, :load_paths => ['src/scss'], :style => 'compressed')
	File.write('build/sparehanger.css', engine.render)
	puts "src/scss/sparehanger.scss -> build/sparehanger.css"
end
