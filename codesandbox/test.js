// get the outer height of all the .nav-bar-link-group elements inside of .test and add them together, and set that to the the outer height of the nav-bar-bg elements inside of .test

$(document).ready(function () {
  const navBarLinkGroupHeight = $(".test .nav-bar-link-group")
    .toArray()
    .reduce((acc, el) => acc + $(el).outerHeight(), 0);
  $(".test .nav-bar-bg").outerHeight(navBarLinkGroupHeight);
});

// write the same in vanilla JS
document.addEventListener("DOMContentLoaded", function () {
  const navBarLinkGroupHeight = Array.from(
    document.querySelectorAll(".test .nav-bar-link-group")
  ).reduce((acc, el) => acc + el.offsetHeight, 0);
  Array.from(document.querySelectorAll(".test .nav-bar-bg")).forEach(
    (el) => (el.style.height = `${navBarLinkGroupHeight}px`)
  );
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




//show the position of #prezzee-api in the document as we scroll
$(window).on("scroll", function () {
  const prezzeeApiPosition = $("#prezzee-api").position().top;
  console.log(prezzeeApiPosition);
}
);

//now show the position of #prezzee-api in the document when it's rendered from the top which should be the same as the previous console.log and also should not change
console.log($("#prezzee-api").position().top);

lenis.scrollTo($("#prezzee-api").position().top)


//ge the position top css of #solutions-overview-anchors-sticky
console.log($("#solutions-overview-anchors-sticky").css("top"));