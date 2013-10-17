app = {
  primeOptionBar: ->
    options = $(".option-bar li")
    optionWidth = 100 / options.length
    
    # font size is defined by a parabola with vertex (1, 1) downward sloping
    options.css
      width: optionWidth - 0.40 + "%"
      "font-size": (-1 / 150 * Math.pow(options.length - 1, 2) + 1) + "rem"


  primeHoverView: ->
    views = $(".hover-view")
    views.hover (->
      $(this).children(".hover-img").css opacity: 0
      $(this).children(".hover-content").css opacity: 1
      $(this).children(".hover-tools").css opacity: 1
    ), ->
      $(this).children(".hover-img").css opacity: 1
      $(this).children(".hover-content").css opacity: 0
      $(this).children(".hover-tools").css opacity: 0


  primeAlertClose: ->
    $(".alert .close").click ->
      $(this).parents(".alert").hide()


  primeDropdown: ->
    $(".dropdown-toggle").click ->
      parent = $(this).parent()
      $(".dropdown-list", parent).show()

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
    @primeHoverView()
    @primeAlertClose()
    @primeDropdown()
    @primePopup()
    true
}

app.go()