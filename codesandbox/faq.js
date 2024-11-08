$(document).ready(function () {
  if ($(".faq-section").length) {
    console.log("faq section is present");

    /*
    ********************************
        FAQ Dropdown interaction
    ********************************
    */

    $(".faq-list-item").each(function () {
      var triggerHeight = $(this).find(".faq-list-trigger").outerHeight();
      $(this).css("height", triggerHeight);
    });

    $(".faq-list-trigger").click(function () {
      var $faqListItem = $(this).closest(".faq-list-item");
      var $faqListResult = $faqListItem.find(".faq-list-result");
      var $dropdownIcon = $(this).find(".dropdown-icon");
      var $faqListTrigger = $(this);

      if ($faqListItem.hasClass("expanded")) {
        $faqListItem.removeClass("expanded");
        $faqListTrigger.removeClass("expanded");
        $faqListItem.css("height", $faqListTrigger.outerHeight());
        $dropdownIcon.removeClass("opened");
      } else {
        if ($(window).width() > 768) {
          $(".faq-list-item").each(function () {
            $(this).removeClass("expanded");
            $(this).find(".faq-list-trigger").removeClass("expanded");
            $(this).css(
              "height",
              $(this).find(".faq-list-trigger").outerHeight()
            );
            $(this).find(".dropdown-icon").removeClass("opened");
          });
        }

        $faqListItem.addClass("expanded");
        $faqListTrigger.addClass("expanded");
        var contentHeight =
          $faqListResult.outerHeight() + $faqListTrigger.outerHeight();
        $faqListItem.css("height", contentHeight);
        $dropdownIcon.addClass("opened");
      }
    });

    /*
    **************************
        FAQ Categorization
    **************************
    */

    if ($("[data-faq-category-name]").length) {
      var categoryName = $("[data-faq-category-name]").attr(
        "data-faq-category-name"
      );

      $(".faq-list-item").each(function () {
        var categoryList = $(this).find("[data-faq-category-list]").text();

        if (categoryList.includes(categoryName)) {
          $(this).show(); // Keep the FAQ visible if the category name is present
        } else {
          $(this).remove(); // Remove the FAQ from the page if the category name is not present
        }
      });
    }

    /*
    ********************************
        FAQ Load More interaction
    ********************************
    */

    // var $faqSet2 = $("#faq-set-2");
    // // by default, set the height of the faq set 2 to 0
    // $faqSet2.css("height", 0);

    // // Handle the click event on Load More / Show Less button
    // $("#faq-load-more").click(function (e) {
    //   e.preventDefault();

    //   var $loadMoreBtn = $(this);

    //   if ($loadMoreBtn.hasClass("expanded")) {
    //     $loadMoreBtn.removeClass("expanded");
    //     //set the height of the faq set 2 to 0
    //     $faqSet2.css("height", 0);
    //     //update the text of the div inside of $loadMoreBtn to "Load More"
    //     $loadMoreBtn.find("div").text("Load More");
    //   } else {
    //     //set the height of the faq set 2 to auto
    //     $faqSet2.css("height", "auto");
    //     $loadMoreBtn.addClass("expanded");
    //     //update the text of the div inside of $loadMoreBtn to "Show Less"
    //     $loadMoreBtn.find("div").text("Show Less");
    //   }
    // });
  }
});
