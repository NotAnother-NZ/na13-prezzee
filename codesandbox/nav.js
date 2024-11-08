// Hide the scrollbar for the horizontal scrolling container on mobile
$(document).ready(function () {
  if ($(window).width() < 768) {
    $(".solutions-overview-anchors").css({
      "overflow-x": "scroll",
      "overflow-y": "hidden",
      "-ms-overflow-style": "none", // For Internet Explorer and Edge
      "scrollbar-width": "none", // For Firefox
    });
  }
});

$(document).ready(function () {
  if ($("#nav").length) {
    console.log("nav is present");


    var $sections = $("[data-top-bar-bg-color]");
    var useCasesOpen = false;
    var solutionsOpen = false;
    var mobileNavOpen = false;

    function checkActiveSection() {
      var scrollTop = $(window).scrollTop();
      var activeFound = false;

      $sections.each(function () {
        var $this = $(this);
        var sectionOffset = $this.offset().top;
        var sectionHeight = $this.outerHeight();
        var positionFromViewportTop = sectionOffset - scrollTop;

        if (
          positionFromViewportTop <= $("#top-bar").outerHeight() &&
          positionFromViewportTop + sectionHeight > $("#top-bar").outerHeight()
        ) {
          var bgColor = $this.attr("data-top-bar-bg-color");

          if (bgColor.startsWith("var(")) {
            var cssVariable = bgColor.slice(4, -1).trim();
            bgColor = getComputedStyle(
              document.documentElement
            ).getPropertyValue(cssVariable);
          }

          $(".top-bar-bg, #top-bar").css("background-color", bgColor);
          activeFound = true;

          if ($this.attr("data-top-bar-bg-type") === "dark") {
            $(
              "#nav-for-business-button, #nav-for-personal-button, #nav-locale-button"
            ).css("color", "var(--swatches--off-white)");
            $("#nav-locale-button, #nav-for-business-button").css(
              "border-bottom-color",
              "var(--swatches--off-white)"
            );
            $("#top-bar").css(
              "border-bottom-color",
              "var(--swatches--white-15)"
            );
            $(
              "#nav-search-icon img:first-child, #nav-globe-icon img:first-child"
            ).hide();
            $(
              "#nav-search-icon img:nth-child(2), #nav-globe-icon img:nth-child(2)"
            ).show();
          } else {
            $(
              "#nav-for-business-button, #nav-for-personal-button, #nav-locale-button"
            ).css("color", "");
            $("#nav-locale-button, #nav-for-business-button").css(
              "border-bottom-color",
              ""
            );
            $("#top-bar").css("border-bottom-color", "");
            $(
              "#nav-search-icon img:first-child, #nav-globe-icon img:first-child"
            ).show();
            $(
              "#nav-search-icon img:nth-child(2), #nav-globe-icon img:nth-child(2)"
            ).hide();
          }

          return false;
        }
      });

      if (!activeFound) {
        $(".top-bar-bg, #top-bar").css("background-color", "");
        $(
          "#nav-for-business-button, #nav-for-personal-button, #nav-locale-button"
        ).css("color", "");
        $("#nav-locale-button, #nav-for-business-button").css(
          "border-bottom-color",
          ""
        );
        $("#top-bar").css("border-bottom-color", "");
        $(
          "#nav-search-icon img:first-child, #nav-globe-icon img:first-child"
        ).show();
        $(
          "#nav-search-icon img:nth-child(2), #nav-globe-icon img:nth-child(2)"
        ).hide();
      }
    }

    checkActiveSection();

    $(window).on("scroll", function () {
      checkActiveSection();
    });

    if ($(".nav-bar-bg.white-5").length) {
      $(".nav-bar-link-group, .nav-bar-group").css(
        "color",
        "var(--swatches--off-white)"
      );
      $(".nav-bar-dropdown-icon.is-light").show();
      $(".nav-bar-dropdown-icon.is-dark").hide();
    }

    function setLinkGroupPosition() {
      var leftPosition =
        $("#nav-bar-link-group-ref").offset().left - $(window).scrollLeft();
      $(".nav-bar-link.type2").css("margin-left", leftPosition + "px");
      $(".nav-bar-link.type3").css("margin-left", leftPosition + "px");
      $(".nav-bar-link.type4").css("margin-left", leftPosition + "px");
    }

    setLinkGroupPosition();
    $(window).on("resize scroll", setLinkGroupPosition);

    setTimeout(function () {
      $(".nav-bar.type2").css("opacity", "1");
      $(".nav-bar.type2").css("height", "auto");
      $(".nav-bar.type2").css("height", "0");
      $(".nav-bar.type2").css("pointer-events", "auto");
    }, 1000);

    $("#nav-use-cases-click").on("click", function () {
      if (!useCasesOpen) {
        if (solutionsOpen) {
          $("#solutions-nav-close").click();
          solutionsOpen = false;
        }
        $("#use-cases-nav-open").click();
        useCasesOpen = true;
      } else {
        $("#use-cases-nav-close").click();
        useCasesOpen = false;
      }
    });

    $("#nav-solutions-click").on("click", function () {
      if (!solutionsOpen) {
        if (useCasesOpen) {
          $("#use-cases-nav-close").click();
          useCasesOpen = false;
        }
        $("#solutions-nav-open").click();
        solutionsOpen = true;
      } else {
        $("#solutions-nav-close").click();
        solutionsOpen = false;
      }
    });

    $(document).on("click", function (e) {
      if (
        !$(e.target).closest("#nav").length &&
        (useCasesOpen || solutionsOpen)
      ) {
        if (useCasesOpen) {
          $("#use-cases-nav-close").click();
          useCasesOpen = false;
        }
        if (solutionsOpen) {
          $("#solutions-nav-close").click();
          solutionsOpen = false;
        }
      }
    });

    $("#mobile-nav-menu").on("click", function () {
      if (!mobileNavOpen) {
        $("#mobile-nav-open").click();
        mobileNavOpen = true;
        $("#mobile-nav-menu-text").text("Close");
        lenis.stop();
        setTimeout(function () {
          const navBarLinkGroupHeight = $(".test .nav-bar-link-group")
            .toArray()
            .reduce((acc, el) => acc + $(el).outerHeight(), 0);
          $(".test .nav-bar-bg").outerHeight(navBarLinkGroupHeight);
        }, 1000);
      } else {
        $("#mobile-nav-close").click();
        mobileNavOpen = false;
        $("#mobile-nav-menu-text").text("Menu");
        lenis.start();
      }
    });
  }
});
