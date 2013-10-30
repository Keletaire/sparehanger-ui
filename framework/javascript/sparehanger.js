app = {
	self: this,
	name: "Spare Hanger JS",

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

	objects: {
		filterByString: function(filter, containerClass) {
			containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
			var container = $(containerClass);
			container.find(".hover-view").show();
			if (filter.length > 0) {
				var unwantedObjects = container.find(".hover-view:not([data-index*='" + filter + "'])");
				unwantedObjects.hide();
			}
		},

		filterByClasses: function(classNames, containerClass) {
			containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
			var container = $(containerClass);	
			var filter = "";
			for (var i = 0; i < classNames.length; i++) {
				filter += (i + 1 == classNames.length) ? classNames[i] : classNames[i] + ", ";
			}

			container.find(".hover-view").show();
			if (filter.length > 0) {
				var unwantedObjects = container.find(".hover-view:not(" + filter + ")");
				unwantedObjects.hide();
			}
		},

		add: function(objects, containerClass) {
			containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
			var container = $(containerClass);
			var currentObjects = container.find('.hover-view');
			container.find(".hover-view:nth-child(" + currentObjects.length + ")").after(objects);
		},

		ajax: {
			getItems: function(amount, filters, containerClass) {
				amount = typeof amount !== 'undefined' ? amount : 20;
				filters = typeof filters !== 'undefined' ? filters : {};
				containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
				var itemsOnPage = $(containerClass).find(".hover-view").length;

				$.ajax({
					data: decodeURIComponent($.param({
						ajax: true,
						itemsOnPage: itemsOnPage,
						filters: filters,
						amount: amount,
					})),
					url: "/items",
					dataType: 'html',
					success: function(data) {
						app.objects.add(data, containerClass);
					}
				});
			}
		},
	},

	go: function() {
		this.initializeGrid();
		this.primeOptionBar();
		this.primeAlertClose();
		this.primeDropdown();
		this.primePopup();
	}
};

$(function() {
	app.go();

	$(window).scroll(function() {
		 if($(window).scrollTop() + $(window).height() == $(document).height()) {
			app.objects.ajax.getItems();
		 }
	});
});