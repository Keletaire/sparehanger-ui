
App = function() {
	this.go = function() {
		this.setOptionBar();
		this.setHoverView();
		this.setAlertClose();
	}

	this.setOptionBar = function() {
		var options = $('.option-bar li');
		var optionWidth = 100 / options.length
		// font size is defined by a parabola with vertex (1, 1) downward sloping
		options.css({
			"width":     optionWidth - 0.28 + "%",
			"font-size": (-1/150 * Math.pow(options.length - 1, 2) + 1) + "rem"
		});
	}

	this.setHoverView = function() {
		var views = $('.hover-view');
		views.hover(function() {
			$(this).children('.hover-img').css({opacity: 0});
			$(this).children('.hover-content').css({opacity: 1});
			$(this).children('.hover-tools').css({opacity: 1});
		}, function() {
			$(this).children('.hover-img').css({opacity: 1});
			$(this).children('.hover-content').css({opacity: 0});
			$(this).children('.hover-tools').css({opacity: 0});
		});
	}

	this.setAlertClose = function() {
		$('.alert .close').click(function() {
			$(this).parents('.alert').hide();
		});
	}
};

$(function() {
	app = new App();
	app.go();
});