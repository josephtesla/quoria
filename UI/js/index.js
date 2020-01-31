jQuery(document).on('ready', function ($) {
  "use strict";

  /*---------------------------
      HOME SLIDER
  -----------------------------*/
  var $homeSlider = $('.welcome-slider-area');
  $homeSlider.owlCarousel({
      merge: true,
      smartSpeed: 2000,
      loop: true,
      nav: true,
      navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      autoplay: true,
      autoplayTimeout: 5000,
      margin: 0,
      animateIn: 'fadeIn',
      animateOut: 'fadeOut',
      responsiveClass: true,
      responsive: {
          0: {
              items: 1
          },
          600: {
              items: 1
          },
          1000: {
              items: 1
          },
          1200: {
              items: 1
          }
      }
  });


}(jQuery));

