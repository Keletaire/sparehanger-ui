app = {
	name: "Spare Hanger JS"
	
	primeIsotope: ->
		$("[isotope]").isotope(
			itemSelector: $(this).attr('isotope'),
			layoutMode: 'masonry',
			animationOptions:
				duration: 100,
				easing: 'linear'
		)


	primeOptionBar: ->
		options = $(".option-bar li")
		optionWidth = 100 / options.length
		
		# font size is defined by a downward sloping parabola with vertex (1 element, 1 rem).
		# basically - options go up, font size goes down
		options.css
			width:       optionWidth - 0.40 + "%"
			"font-size": (-1 / 150 * Math.pow(options.length - 1, 2) + 1) + "rem"


	primeAlertClose: ->
		$(".alert .close").click ->
			$(this).parents(".alert").hide()
		$(".alert.temporary").fadeOut 10000


	primeDropdown: ->
		$(".dropdown-toggle").click ->
			list = $(".dropdown-list", $(this).parent());
			list.addClass('active')
			list.css("left", "-150px") if list.offset().left < 150
			list.show()
		$(document).on 'click', (e) ->
			if $(e.target).hasClass('dropdown-list') or $(e.target).hasClass('dropdown-toggle') or $(e.target).parent().hasClass('dropdown-toggle')
				return
			dropdowns = $('.dropdown-list.active')
			if dropdowns.length > 0
				dropdowns.removeClass 'active'
				dropdowns.hide()
				console.log "There's a dropdown open"


	primePopup: ->
		$('.popup-toggle').click ->
			$($(this).attr('href')).addClass 'active'
		$('.popup-content .close').click ->
			$(this).parents('.popup-content').removeClass 'active'


	initializeGrid: ->
		$("[class*='column-']").each ->
			percent = $(this).attr("class").match(/\d+/g)
			$(this).css "width", percent + "%"


	go: ->
		@initializeGrid()
		@primeOptionBar()
		@primeIsotope()
		@primeAlertClose()
		@primeDropdown()
		@primePopup()
		true
}

app.go()