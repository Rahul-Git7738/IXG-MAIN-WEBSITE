/* Main js */
(function ($) {
  "use strict";

  /*  Loader  */
  $(window).on("load", function () {
    $(".bl-loader").fadeOut("slow");
  });

  /*  Stickey headre on scroll &&  Menu Fixed On Scroll Active  */
  var doc = document.documentElement;
  var w = window;

  var blprevScroll = w.scrollY || doc.scrollTop;
  var blcurScroll;
  var bldirection = 0;
  var blprevDirection = 0;

  var checkScroll = function () {

    blcurScroll = w.scrollY || doc.scrollTop;
    if (blcurScroll > blprevScroll) {
      bldirection = 2;
    }
    else if (blcurScroll < blprevScroll) {
      bldirection = 1;
    }

    if (bldirection !== blprevDirection) {
      toggleHeader(bldirection, blcurScroll);
    }

    blprevScroll = blcurScroll;
  };

  var toggleHeader = function (bldirection, blcurScroll) {

    if (bldirection === 2 && blcurScroll > 0) {
      blprevDirection = bldirection;
      $(".sticky-nav").addClass("menu_fixed_up");
      $(".sticky-nav-2").removeClass("menu_fixed_up");
    }
    else if (bldirection === 1) {
      blprevDirection = bldirection;
      $(".sticky-nav").addClass("menu_fixed");
      $(".sticky-nav-2").removeClass("menu_fixed");
      $(".sticky-nav").removeClass("menu_fixed_up");
      $(".sticky-nav-2").addClass("menu_fixed_up");
    }
  };

  $(window).on("scroll", function () {
    var distance = 10;
    var $window = $(window);
    if ($window.scrollTop() <= distance) {
      $(".sticky-nav").removeClass("menu_fixed");
      $(".sticky-nav-2").addClass("menu_fixed");
    }
    else {
      checkScroll();
    }
  });

  /* Toggle menu open */
  const bl_toggle = document.querySelector(".toggle-btn");
  const menu = document.querySelector(".menu");

  if (bl_toggle && menu) {
    bl_toggle.addEventListener("click", () => {
      const isActive = bl_toggle.classList.toggle("active");
      menu.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    });
  }

  /* Label slider */
  $(function () {
    // Check if the element exists
    if ($('.label-auto').length > 0) {
      $('.label-auto').infiniteslide({
        direction: 'left',
        speed: 50,
        clone: 10
      });
    }
  });

  /*  Onclick icon expand education and experience  */
  $(".box-title .icon").on("click", function () {
    const $current = $(this).parent().siblings(".details");
    $(".details").not($current).slideUp("slow"); // close others
    $current.slideToggle("slow"); // toggle current
  });

  /* Portfolio */
  $(function () {
    if ($('.item-grid').length > 0) {
      var filterList = {
        init: function () {
          $('.item-grid').mixItUp({
            selectors: {
              target: '.item',
              filter: '.filter'
            },
            load: {
              filter: 'all'
            }
          });
        }
      };
      filterList.init();
    }
  });

  /* Blog */
  $(function () {
    if ($('.bl-blog-wrap').length > 0) {
      $('.bl-blog-wrap').owlCarousel({
        loop: true,
        margin: 24,
        responsiveClass: true,
        dots: false,
        nav: false,
        pagination: false,
        responsive: {
          0: {
            items: 1,
          },
          768: {
            items: 2,
          },
          992: {
            items: 3,
          }
        }
      });
    }
  });

  /* Testimonials */
  $(function () {
    if ($('.testimonials-slider').length > 0) {
      $('.testimonials-slider').owlCarousel({
        loop: true,
        margin: 24,
        responsiveClass: true,
        dots: false,
        nav: false,
        pagination: false,
        autoplay: true,
        autoplaySpeed: 2000,
        autoplayHoverPause: false,
        responsive: {
          0: {
            items: 1,
          },
          992: {
            items: 2,
          }
        }
      });
    }
  });
  /* Brand */
  $(function () {
    if ($('.bl-brand-slider').length > 0) {
      $('.bl-brand-slider').owlCarousel({
        loop: true,
        margin: 24,
        responsiveClass: true,
        dots: false,
        nav: false,
        pagination: false,
        autoplay: true,
        autoplaySpeed: 2000,
        autoplayHoverPause: false,
        responsive: {
          0: {
            items: 2,
          },
          421: {
            items: 3,
          },
          768: {
            items: 4,
          },
          992: {
            items: 5,
          },
          1200: {
            items: 6,
          },
          1400: {
            items: 7,
          }
        }
      });
    }
  });

  /**  Pricing Tab Effect  **/
$(document).ready(function () {

  const $tabs = $(".tab-btn");
  const $prices = $(".plan-price .price");
  const $overlay = $(".overlay-active");

  // ✅ Condition: if elements not found → stop
  if (!$tabs.length || !$prices.length || !$overlay.length) return;

  const pricingData = {
    monthly: [0, 29, 59, 99],
    annually: [0, 23, 47, 79],
  };

  // 🔥 Tab click (price + active state)
  $tabs.on("click", function (e) {
    e.preventDefault();

    const $tab = $(this);
    const plan = $tab.data("plan");

    if (!pricingData[plan]) return; // ✅ safe condition

    $tabs.removeClass("active");
    $tab.addClass("active");

    $prices.each(function (i) {
      const $price = $(this);
      const newPrice = pricingData[plan][i];

      if (newPrice === undefined) return; // ✅ safety

      gsap.to({ val: parseInt($price.text().replace("$", ""), 10) || 0 }, {
        val: newPrice,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: function () {
          $price.text("$" + Math.round(this.targets()[0].val));
        },
        onComplete: function () {
          $price.text("$" + newPrice);
        }
      });
    });

    $(".duration").text(plan === "monthly" ? "/month" : "/year");

    setOverlayPosition($tab);
  });

  // 🔥 Overlay position
  function setOverlayPosition($el) {
    if (!$el.length) return;

    const el = $el[0];
    const parent = el.parentElement;

    if (!parent) return;

    const rect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    gsap.to($overlay, {
      left: rect.left - parentRect.left,
      width: rect.width,
      duration: 0.4,
      ease: "power2.out",
    });
  }

  // ✅ Set initial overlay
  const $activeTab = $(".tab-btn.active");
  if ($activeTab.length > 0) {
    setOverlayPosition($activeTab);
  }

});

  /* Tab to top */
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".back-to-top").fadeIn();
    } else {
      $(".back-to-top").fadeOut();
    }
  });

  var blprogressPath = document.querySelector('.back-to-top-wrap path');
  var pathLength = blprogressPath.getTotalLength();
  blprogressPath.style.transition = blprogressPath.style.WebkitTransition = 'none';
  blprogressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
  blprogressPath.style.strokeDashoffset = pathLength;
  blprogressPath.getBoundingClientRect();
  blprogressPath.style.transition = blprogressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
  var updateProgress = function () {
    var scroll = $(window).scrollTop();
    var height = $(document).height() - $(window).height();
    var progress = pathLength - (scroll * pathLength / height);
    blprogressPath.style.strokeDashoffset = progress;
  }
  updateProgress();
  $(window).scroll(updateProgress);
  var offset = 50;
  var duration = 550;
  jQuery(window).on('scroll', function () {
    if (jQuery(this).scrollTop() > offset) {
      jQuery('.back-to-top-wrap').addClass('active-progress');
    } else {
      jQuery('.back-to-top-wrap').removeClass('active-progress');
    }
  });
  jQuery('.back-to-top-wrap').on('click', function (event) {
    event.preventDefault();
    jQuery('html, body').animate({ scrollTop: 0 }, duration);
    return false;
  });

  /*  Copyright years JS  */
  var el_copyright_year = document.getElementById("copyright_year");

  if (el_copyright_year) {
    var date = new Date().getFullYear();
    el_copyright_year.innerHTML = date;
  }

  /*  Light & Dark Mode JS  */
  $('.toggle-mode').on('click', function () {
    const $icon = $(this).find('i');
    const $existingLink = $('#light_mode');

    if ($existingLink.length === 0) {
      // Add light mode CSS
      const $link = $('<link>', {
        rel: 'stylesheet',
        id: 'light_mode',
        href: 'assets/css/light-mode.css'
      });
      $('head').append($link);

      // Change icon to moon
      $icon.removeClass('ri-sun-line').addClass('ri-moon-line');
    } else {
      // Remove light mode CSS
      $existingLink.remove();

      // Change icon back to sun
      $icon.removeClass('ri-moon-line').addClass('ri-sun-line');
    }
  });

})(jQuery);

