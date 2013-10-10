
App = function() {
	this.go = function() {
		this.initializeGrid();
		this.primeOptionBar();
		this.primeHoverView();
		this.primeAlertClose();
		this.primeDropdown();
	}

	this.primeOptionBar = function() {
		var options = $('.option-bar li');
		var optionWidth = 100 / options.length
		// font size is defined by a parabola with vertex (1, 1) downward sloping
		options.css({
			"width":     optionWidth - 0.28 + "%",
			"font-size": (-1/150 * Math.pow(options.length - 1, 2) + 1) + "rem"
		});
	}

	this.primeHoverView = function() {
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

	this.primeAlertClose = function() {
		$('.alert .close').click(function() {
			$(this).parents('.alert').hide();
		});
	}

	this.primeDropdown = function() {
		var anyClick = $('h2').click(function() {
			// a click has happened, anywhere
		});
		$('.dropdown-toggle').click(function() {
			var parent = $(this).parent();
			$('.dropdown-list', parent).show();
		});
	}

	this.initializeGrid = function() {
		$("[class*='column-']").each(function() {
			var percent = $(this).attr('class').match(/\d+/g);
			$(this).css('width', percent + "%");
		});
	}
};

$(function() {
	app = new App();
	app.go();
}); 