app = {

	settings: {
		isLoading: false
	},

	addListenerToSearchBar: function() {
		$('.ui-navbar-search').on('input', function() {
			app.hoverviews.filterByString($(this).val());
		});
	},

	resizeOptionBars: function() {
		var options = $(".ui-option-bar li");
		var optionWidth = 100 / options.length;
		options.css({
			width: optionWidth - 0.40 + "%",
			"font-size": (-1 / 150 * Math.pow(options.length - 1, 2) + 1) + "rem"
		});
	},

	addListenerToAlertClose: function() {
		$(".ui-alert .ui-close").click(function() {
			$(this).parents(".alert").hide();
		});

		$(".ui-alert.ui-temporary").fadeOut(10000);
	},

	addListenerToHoverTools: function() {
		var favoriteIcons = $('.favorite-icon');
		var closetIcons = $('.closet-icon');

		favoriteIcons.unbind('click');
		favoriteIcons.click(function() {
			app.ajax.toggleFavorite($(this).data("id"), $(this).data("type"));
		});

		closetIcons.unbind('click');
		closetIcons.click(function() {
			app.ajax.toggleClosetItem($(this).data("id"));
		});
	},

	addListenerToDropdowns: function() {
		$(".ui-dropdown-toggle").click(function() {
			var list = $(".ui-dropdown-list", $(this).parent());
			list.addClass('ui-active');
			if (list.position().left < 150) {
				list.css("left", "-150px");
			}
			list.show();
		});

		$(document).on('click', function(e) {
			if ($(e.target).hasClass('ui-dropdown-list') || $(e.target).hasClass('ui-dropdown-toggle') || $(e.target).parent().hasClass('ui-dropdown-toggle')) {
				return;
			}
			var dropdowns = $('.ui-dropdown-list.ui-active');
			if (dropdowns.length > 0) {
				dropdowns.removeClass('active');
				dropdowns.hide();
			}
		});
	},

	addListenerToPopups: function() {
		$('.ui-popup-toggle').click(function() {
			$($(this).attr('href')).addClass('ui-active');
		});
		$('.ui-popup-content .ui-close').click(function() {
			$(this).parents('.ui-popup-content').removeClass('ui-active');
		});
	},

	initializeGrid: function() {
		$("[class*='ui-column-']").each(function() {
			var percent = $(this).attr("class").match(/\d+/g);
			$(this).css("width", percent + "%");
		});
	},

	infiniteScroll: function(callback) {
		$(window).scroll(function() {
			 if($(window).scrollTop() + $(window).height() == $(document).height()) {
		 		callback();
			 }
		});
	},

	hoverviews: {
		centerAllObjects: function() {
			var containers = $('.ui-hover-view').parent();
			containers.css('text-align', 'center');
		},

		filterByString: function(filter, containerClass) {
			containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
			var container = $(containerClass);
			container.find(".ui-hover-view").show();
			if (filter.length > 0) {
				var unwantedObjects = container.find(".ui-hover-view:not([data-index*='" + filter + "'])");
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

			container.find(".ui-hover-view").show();
			if (filter.length > 0) {
				var unwantedObjects = container.find(".ui-hover-view:not(" + filter + ")");
				unwantedObjects.hide();
			}
		},

		add: function(objects, containerClass) {
			containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
			var container = $(containerClass);
			var currentObjects = container.find('.ui-hover-view');
			container.find(".ui-hover-view:nth-child(" + currentObjects.length + ")").after(objects);
		}
	},

	ajax: {
		items: function(attributes, amount, sortBy, imageWidth, containerClass) {
			console.log('isLoading:' + app.settings.isLoading);
			if (!app.settings.isLoading) {
				app.settings.isLoading = true;
				amount = typeof amount !== 'undefined' ? amount : 20;
				attributes = typeof attributes !== 'undefined' ? attributes : {};
				sortBy = typeof sortBy !== 'undefined' ? sortBy : "none";
				containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
				imageWidth = typeof imageWidth !== 'undefined' ? imageWidth : $('.ui-hover-view .ui-hover-img img', containerClass).width();
				if (sortBy == "none" && document.URL.match(/trending|best|new/i)) {
					sortBy = document.URL.match(/trending|best|new/i)[0];
				}
				var itemsOnPage = $(".ui-hover-view", containerClass).length;

				$.ajax({
					data: decodeURIComponent($.param({
						itemsOnPage: itemsOnPage,
						attributes: attributes,
						amount: amount,
						width: imageWidth,
						sortby: sortBy
					})),
					url: "/ajax/items",
					dataType: 'html',
					success: function(data) {
						app.hoverviews.add(data, containerClass);
						app.addListenerToHoverTools();
						app.settings.isLoading = false;
					}
				});
			}
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
							icon.removeClass('ui-red');
							count.text((Number(count.text()) - 1).toString());
						} else {
							icon.addClass('ui-red');
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
							icon.removeClass('ui-green');
							count.text((Number(count.text()) - 1).toString());
						} else {
							icon.text('check');
							icon.addClass('ui-green');
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
	},

	init: function() {
		this.initializeGrid();
		this.hoverviews.centerAllObjects();
		this.resizeOptionBars();
		this.addListenerToAlertClose();
		this.addListenerToDropdowns();
		this.addListenerToPopups();
		this.addListenerToHoverTools();
		this.addListenerToSearchBar();
	}
};

$(function() { app.init(); });
