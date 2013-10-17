(function() {
  var app;

  app = {
    name: "Spare Hanger JS",
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
      $(".dropdown-toggle").click(function() {
        var list;
        list = $(".dropdown-list", $(this).parent());
        list.addClass('active');
        return list.show();
      });
      return $(document).on('click', function(e) {
        var dropdowns;
        if ($(e.target).hasClass('dropdown-list') || $(e.target).hasClass('dropdown-toggle') || $(e.target).parent().hasClass('dropdown-toggle')) {
          return;
        }
        dropdowns = $('.dropdown-list.active');
        if (dropdowns.length > 0) {
          dropdowns.removeClass('active');
          dropdowns.hide();
          return console.log("There's a dropdown open");
        }
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
    primeUnslider: function() {
      return $('.unslider').unslider({
        dots: true,
        keys: true,
        fluid: true
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
      this.primePopup();
      this.primeUnslider();
      return true;
    }
  };

  app.go();

}).call(this);
