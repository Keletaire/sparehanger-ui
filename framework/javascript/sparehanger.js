app = {

	settings: {},

	addListenerToSearchBar: function() {
		$('.navbar-search').on('input', function() {
			app.hoverviews.filterByString($(this).val());
		});
	},

	resizeOptionBars: function() {
		var options = $(".option-bar li");
		var optionWidth = 100 / options.length;
		options.css({
			width: optionWidth - 0.40 + "%",
			"font-size": (-1 / 150 * Math.pow(options.length - 1, 2) + 1) + "rem"
		});
	},

	addListenerToAlertClose: function() {
		$(".alert .close").click(function() {
			$(this).parents(".alert").hide();
		});

		$(".alert.temporary").fadeOut(10000);
	},

	addListenerToHoverTools: function() {
		var favoriteIcons = $('.favorite-icon');
		var closetIcons = $('.closet-icon');

		favoriteIcons.unbind('click');
		favoriteIcons.click(function() {
			app.hoverviews.ajax.toggleFavorite($(this).data("id"), $(this).data("type"));
		});

		closetIcons.unbind('click');
		closetIcons.click(function() {
			app.hoverviews.ajax.toggleClosetItem($(this).data("id"));
		});
	},

	addListenerToDropdowns: function() {
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

	addListenerToPopups: function() {
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

	hoverviews: {
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
			getItems: function(filters, amount, containerClass) {
				amount = typeof amount !== 'undefined' ? amount : 20;
				filters = typeof filters !== 'undefined' ? filters : {};
				containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
				var itemsOnPage = $(containerClass).find(".hover-view").length;

				$.ajax({
					data: decodeURIComponent($.param({
						ajax: true,
						itemsOnPage: itemsOnPage,
						filters: filters,
						amount: amount
					})),
					url: "/items",
					dataType: 'html',
					success: function(data) {
						app.hoverviews.add(data, containerClass);
						app.addListenerToHoverTools();
					}
				});
			},

			toggleFavorite: function(id, type) {
				$.ajax({
					dataType: "json",
					data: {id: id, type: type},
					type: "post",
					url: "/items/favorites/toggle",
					success: function(data) {
						if (data.success) {
							var icon = $('*[data-id="' + id + '"].favorite-icon');
							var count = $('*[data-id="' + id + '"].favorite-icon + .count');

							if (data.action == "deleted") {
								icon.removeClass('red');
								count.text((Number(count.text()) - 1).toString());
							} else {
								icon.addClass('red');
								count.text((Number(count.text()) + 1).toString());
							}
						} else if (data.code == '0') {
							window.location = "/user/registration";
						} else {
							alert("Error " + data.code + ": " + data.message);
						}
					}
				});
			},

			toggleClosetItem: function(id, amount) {
				amount = typeof amount !== 'undefined' ? amount : 1;
				$.ajax({
					dataType: "json",
					data: {id: id, amount: amount},
					type: "post",
					url: "/closets/default/toggle",
					success: function(data) {
						if (data.success) {
							var icon = $('*[data-id="' + id + '"].closet-icon');
							var count = $('*[data-id="' + id + '"].closet-icon + .count');

							if (data.action == "deleted") {
								icon.text('plus');
								icon.removeClass('green');
								count.text((Number(count.text()) - 1).toString());
							} else {
								icon.text('check');
								icon.addClass('green');
								count.text((Number(count.text()) + 1).toString());
							}
						} else if (data.code == '0') {
							window.location = "/user/registration";
						} else {
							alert("Error " + data.code + ": " + data.message);
						}
					}
				});
			}
		}
	},

	init: function() {
		this.initializeGrid();
		this.resizeOptionBars();
		this.addListenerToAlertClose();
		this.addListenerToDropdowns();
		this.addListenerToPopups();
		this.addListenerToHoverTools();
		this.addListenerToSearchBar();
	}
};

$(function() { app.init(); });