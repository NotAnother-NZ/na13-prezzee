$(document).ready(function () {
  if ($("#card-redeem").length) {
    console.log("card redeem is present");

    // Move to slide 2
    $("#go-to-slide2").on("click", function (e) {
      e.preventDefault();
      $(".w-slider-dot").eq(1).click(); // Click the dot for slide 2
    });

    // Move to slide 3
    $("#go-to-slide3").on("click", function (e) {
      e.preventDefault();
      $(".w-slider-dot").eq(2).click(); // Click the dot for slide 3
    });

    // Move to slide 4
    $("#go-to-slide4").on("click", function (e) {
      e.preventDefault();
      $(".w-slider-dot").eq(3).click(); // Click the dot for slide 4
    });

    // Move back to slide 1
    $("#go-back-slide").on("click", function (e) {
      e.preventDefault();
      $(".w-slider-dot").eq(0).click(); // Click the dot for slide 1
    });

    // Move to the first slide on #card-redeem-open click
    $("#card-redeem-open").on("click", function (e) {
      e.preventDefault();
      $(".w-slider-dot").eq(0).click(); // Click the dot for slide 1
    });

    // Move to the first slide on #redeem-flow-close click, after 0.5 seconds
    $("#redeem-flow-close").on("click", function (e) {
      // e.preventDefault();
      setTimeout(() => {
        $(".w-slider-dot").eq(0).click(); // Click the dot for slide 1
      }, 500);
    });
  }
});
