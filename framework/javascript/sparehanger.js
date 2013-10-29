app = {
	name: "Spare Hanger JS",

	primeIsotope: function() {
		$("[isotope]").isotope({
			itemSelector: $(this).attr('isotope'),
			layoutMode: 'masonry',
			animationOptions: {
				duration: 100,
				easing: 'linear'
			}
		});
	},

	primeOptionBar: function() {
		var options = $(".option-bar li");
		var optionWidth = 100 / options.length;
		options.css({
			width: optionWidth - 0.40 + "%",
			"font-size": (-1 / 150 * Math.pow(options.length - 1, 2) + 1) + "rem"
		});
	},

	primeAlertClose: function() {
		$(".alert .close").click(function() {
			$(this).parents(".alert").hide();
		});

		$(".alert.temporary").fadeOut(10000);
	},

	primeDropdown: function() {
		$(".dropdown-toggle").click(function() {
			var list = $(".dropdown-list", $(this).parent());
			list.addClass('active');
			if (list.position().left < 150) {
				list.css("left", "-150px");
			}
			list.show();
		});

		$(document).on('click', function(e) {
			if ($(e.target).hasClass('dropdown-list') || $(e.target).hasClass('dropdown-toggle') || $(e.target).parent().hasClass('dropdown-toggle')) {
				return;
			}
			var dropdowns = $('.dropdown-list.active');
			if (dropdowns.length > 0) {
				dropdowns.removeClass('active');
				dropdowns.hide();
			}
		});
	},

	primePopup: function() {
		$('.popup-toggle').click(function() {
			$($(this).attr('href')).addClass('active');
		});
		$('.popup-content .close').click(function() {
			$(this).parents('.popup-content').removeClass('active');
		});
	},

	initializeGrid: function() {
		$("[class*='column-']").each(function() {
			var percent = $(this).attr("class").match(/\d+/g);
			$(this).css("width", percent + "%");
		});
	},
	
	go: function() {
		this.initializeGrid();
		this.primeOptionBar();
		this.primeIsotope();
		this.primeAlertClose();
		this.primeDropdown();
		this.primePopup();
	}
};

$(function() {
	app.go();
});