(function() {
  var app;

  app = {
    primeOptionBar: function() {
      var optionWidth, options;
      options = $(".option-bar li");
      optionWidth = 100 / options.length;
      return options.css({
        width: optionWidth - 0.40 + "%",
        "font-size": (-1 / 150 * Math.pow(options.length - 1, 2) + 1) + "rem"
      });
    },
    primeHoverView: function() {
      var views;
      views = $(".hover-view");
      return views.hover((function() {
        $(this).children(".hover-img").css({
          opacity: 0
        });
        $(this).children(".hover-content").css({
          opacity: 1
        });
        return $(this).children(".hover-tools").css({
          opacity: 1
        });
      }), function() {
        $(this).children(".hover-img").css({
          opacity: 1
        });
        $(this).children(".hover-content").css({
          opacity: 0
        });
        return $(this).children(".hover-tools").css({
          opacity: 0
        });
      });
    },
    primeAlertClose: function() {
      return $(".alert .close").click(function() {
        return $(this).parents(".alert").hide();
      });
    },
    primeDropdown: function() {
      return $(".dropdown-toggle").click(function() {
        var parent;
        parent = $(this).parent();
        return $(".dropdown-list", parent).show();
      });
    },
    primePopup: function() {
      $('.popup-toggle').click(function() {
        return $($(this).attr('href')).addClass('active');
      });
      return $('.popup-content .close').click(function() {
        return $(this).parents('.popup-content').removeClass('active');
      });
    },
    initializeGrid: function() {
      return $("[class*='column-']").each(function() {
        var percent;
        percent = $(this).attr("class").match(/\d+/g);
        return $(this).css("width", percent + "%");
      });
    },
    go: function() {
      this.initializeGrid();
      this.primeOptionBar();
      this.primeHoverView();
      this.primeAlertClose();
      this.primeDropdown();
      return this.primePopup();
    }
  };

  app.go();

}).call(this);
