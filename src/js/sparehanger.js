// The base `app` object, created in the global namespace.
app = {

	settings: {
		// When this is set to true, we are waiting for an ajax response.
		isLoading: false
	},

	addListenerToSearchBar: function() {
		$('.ui-navbar-search').on('input', function() {
			app.hoverviews.filterByString($(this).val());
		});
	},

	// Option bars' options are sized proportinally to how many there are.
	resizeOptionBars: function() {
		var options = $(".ui-option-bar li");
		var optionWidth = 100 / options.length;
		options.css({
			width: optionWidth - 0.40 + "%",
			// Font size is determined by a downward shaping parabola with vertex
			// (1 option, 1rem).
			"font-size": (-1 / 150 * Math.pow(options.length - 1, 2) + 1) + "rem"
		});
	},

	addListenerToAlertClose: function() {
		$(".ui-alert .ui-close").click(function() {
			$(this).parents(".ui-alert").hide();
		});

		$(".ui-alert.ui-temporary").fadeOut(10000);
	},

	addListenerToHoverTools: function() {
		var favoriteIcons = $('.favorite-icon');
		var closetIcons = $('.closet-icon');

				favoriteIcons.unbind('click');
		favoriteIcons.click(function(event) {
			event.preventDefault();
			app.ajax.toggleFavorite($(this).data("id"), $(this).data("type"));
		});

		closetIcons.unbind('click');
		closetIcons.click(function(event) {
			event.preventDefault();
			app.ajax.toggleClosetItem($(this).data("id"));
		});
	},

	addListenerToDropdowns: function() {
		$(".ui-dropdown-toggle").click(function() {
			// The dropdown list in the same container as this.
			var list = $(".ui-dropdown-list", $(this).parent());
			list.addClass('ui-active');
			// A crappy attemppt at trying to figure out how to align the dropdown options
			// based on where they are on the screen.
			if (list.position().left < 150) {
				list.css("left", "-150px");
			}
			list.show();
		});

		// On any click whatsoever..
		$(document).on('click', function(e) {
			// If the click was on the list, the button, or something that is in this element, don't do anything.
			if ($(e.target).hasClass('ui-dropdown-list') || $(e.target).hasClass('ui-dropdown-toggle') || $(e.target).parent().hasClass('ui-dropdown-toggle')) {
				return;
			}

			// Otherwise, hide all lists.
			var dropdowns = $('.ui-dropdown-list.ui-active');
			if (dropdowns.length > 0) {
				dropdowns.removeClass('active');
				dropdowns.hide();
			}
		});
	},

	addListenerToPopups: function() {
		$('.ui-popup-toggle').click(function(event) {
			event.preventDefault();
			// Getting the id of the popup content through the href attribute
			$($(this).attr('href')).addClass('ui-active');
		});
		$('.ui-popup-content').click(function(event) {
			// if the target's class name is the background, close
			if (event.target.className === "ui-popup-content ui-active") {
				$(this).removeClass('ui-active');
			}
		});
	},

	initializeGrid: function() {
		// Find all elements that have a class that starts with `ui-column-`
		$("[class*='ui-column-']").each(function() {
			var percent = $(this).attr("class").match(/\d+/g);
			// Set the width of that element to whatever the digit was in that class name.
			$(this).css("width", percent + "%");
		});
	},

	infiniteScroll: function(callback) {
		$(window).scroll(function() {
			// If we are at the bottom of the page..
			 if($(window).scrollTop() + $(window).height() == $(document).height()) {
				// Do whatever.
				callback();
			 }
		});
	},

	hoverviews: {
		// Necessary because there is no "parent of element" selector in CSS.
		centerAllObjects: function() {
			var containers = $('.ui-hover-view').parent();
			containers.css('text-align', 'center');
		},

		// Relies on hoverviews having a `data-index` attribute
		filterByString: function(filter, containerClass) {
			containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
			var container = $(containerClass);
			// First, show all hoverviews.
			container.find(".ui-hover-view").show();
			if (filter.length > 0) {
				// Then, find all elements whose `data-index` attribute does not contain the filter string.
				var unwantedObjects = container.find(".ui-hover-view:not([data-index*='" + filter + "'])");
				// Finally, hide them.
				unwantedObjects.hide();
			}
		},

		filterByClasses: function(classNames, containerClass) {
			containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
			var container = $(containerClass);
			// Turn `classNames` array into a css-selector string
			var filter = "";
			for (var i = 0; i < classNames.length; i++) {
				filter += (i + 1 == classNames.length) ? classNames[i] : classNames[i] + ", ";
			}
			// First, show all hoverviews.
			container.find(".ui-hover-view").show();
			if (filter.length > 0) {
				// Then, find all elements that are not those classes.
				var unwantedObjects = container.find(".ui-hover-view:not(" + filter + ")");
				// Finally, hide them.
				unwantedObjects.hide();
			}
		},

		add: function(objects, containerClass) {
			containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
			var container = $(containerClass);
			var currentObjects = container.find('.ui-hover-view');
			// Add the content after the last hover view in the container.
			container.find(".ui-hover-view:nth-child(" + currentObjects.length + ")").after(objects);
		}
	},

	ajax: {
		// Requests content from the ItemsController in the Ajax module.
		items: function(attributes, amount, sortBy, imageWidth, containerClass) {
			// Keeping this in here because it's helpful when debugging.
			console.log('isLoading:' + app.settings.isLoading);
			// If we're still waiting for a response from another requst,
			// don't send another one.
			if (!app.settings.isLoading) {
				app.settings.isLoading = true;
				amount = typeof amount !== 'undefined' ? amount : 20;
				attributes = typeof attributes !== 'undefined' ? attributes : {};
				sortBy = typeof sortBy !== 'undefined' ? sortBy : "none";
				containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
				// Find the width of all of the other hoverviews in the container class.
				imageWidth = typeof imageWidth !== 'undefined' ? imageWidth : $('.ui-hover-view .ui-hover-img img', containerClass).width();
				// If we didn't specify a sortBy parameter and the url has one..
				if (sortBy == "none" && document.URL.match(/trending|best|new/i)) {
					// Set `sortBy` to whatever is in the url.
					sortBy = document.URL.match(/trending|best|new/i)[0];
				}
				var itemsOnPage = $(".ui-hover-view", containerClass).length;

				$.ajax({
					// `decodeURIComponent` is necessary because we may have array-type parameters,
					// which jquery doesn't know how to parse correctly.
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
						// New content has been loaded, so set all of our listeners again.
						app.init();
						// We're done loading everything.
						app.settings.isLoading = false;
					}
				});
			}
		},

		outfits: function(attributes, amount, sortBy, imageWidth, containerClass) {
			// Keeping this in here because it's helpful when debugging.
			console.log('isLoading:' + app.settings.isLoading);
			// If we're still waiting for a response from another requst,
			// don't send another one.
			if (!app.settings.isLoading) {
				app.settings.isLoading = true;
				amount = typeof amount !== 'undefined' ? amount : 20;
				attributes = typeof attributes !== 'undefined' ? attributes : {};
				sortBy = typeof sortBy !== 'undefined' ? sortBy : "none";
				containerClass = typeof containerClass !== 'undefined' ? containerClass : ".objects";
				// Find the width of all of the other hoverviews in the container class.
				imageWidth = typeof imageWidth !== 'undefined' ? imageWidth : $('.ui-hover-view .ui-hover-img img', containerClass).width();
				// If we didn't specify a sortBy parameter and the url has one..
				if (sortBy == "none" && document.URL.match(/trending|best|new/i)) {
					// Set `sortBy` to whatever is in the url.
					sortBy = document.URL.match(/trending|best|new/i)[0];
				}
				var outfitsOnPage = $(".ui-hover-view", containerClass).length;

				$.ajax({
					// `decodeURIComponent` is necessary because we may have array-type parameters,
					// which jquery doesn't know how to parse correctly.
					data: decodeURIComponent($.param({
						outfitsOnPage: outfitsOnPage,
						attributes: attributes,
						amount: amount,
						width: imageWidth,
						sortby: sortBy
					})),
					url: "/ajax/outfits",
					dataType: 'html',
					success: function(data) {
						app.hoverviews.add(data, containerClass);
						// New content has been loaded, so set all of our listeners again.
						app.init();
						// We're done loading everything.
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
						// Finds the `favorite-icon` with the given id.
						var icon = $('*[data-id="' + id + '"].favorite-icon');
						var count = $('*[data-id="' + id + '"].favorite-icon + .count');

						if (data.action == "deleted") {
							icon.removeClass('ui-red');
														console.log('Favorite removed.');
							// Increment/decrement the amount of favorites
							count.text((Number(count.text()) - 1).toString());
						} else {
							icon.addClass('ui-red')
														console.log('Favorite added.');
							count.text((Number(count.text()) + 1).toString());
						}
					} else if (data.code == '0') {
						// We need to log in.
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
						// Finds the `closet-icon` with the given id.
						var icon = $('*[data-id="' + id + '"].closet-icon');
						var count = $('*[data-id="' + id + '"].closet-icon + .count');

						if (data.action == "deleted") {
							icon.text('plus');
							icon.removeClass('ui-green');
							// Increment/decrement the amount of owners
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

	// Resize, center, and initialize things. Apply all of our event listeners.
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

// This gets run on every page load.
$(function() { app.init(); });
