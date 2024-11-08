// When the document is loaded
$(document).ready(function () {

  // checking if a swiper slider is present or not
  if ($(".swiper").length) {
    console.log("swiper slider is present");

    const testimonialSwiper = new Swiper(".swiper.testimonial-cards", {
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 20,

      grabCursor: true,
      scrollbar: {
        el: ".swiper-scrollbar",
      },

      // // Navigation arrows
      // navigation: {
      //   nextEl: ".swiper-button-next",
      //   prevEl: ".swiper-button-prev",
      // },
    });

  }

});