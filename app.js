App = function() {
	this.setOptionBar = function() {
		var options = $('.option-bar li');
		var optionWidth = 100 / options.length
		// font size is defined by a parabola with vertex (1, 1) downward sloping
		options.css({
			"width":     optionWidth - 0.4 + "%",
			"font-size": (-1/150 * Math.pow(options.length - 1, 2) + 1) + "rem"
		});
	};

	this.setHoverView = function() {
		$('.hover-view').hover(function() {
			$(this).children('.hover-img').css({opacity: 0});
			$(this).children('.hover-content').css({opacity: 1});
			$(this).children('.hover-tools').css({opacity: 1});
		}, function() {
			$(this).children('.hover-img').css({opacity: 1});
			$(this).children('.hover-content').css({opacity: 0});
			$(this).children('.hover-tools').css({opacity: 0});
		});
	};

	this.setOptionBar();
	this.setHoverView();
};

$(function() { var app = new App() });