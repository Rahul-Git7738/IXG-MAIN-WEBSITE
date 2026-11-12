/* Demo 4 js */

/* Brand slider */
$(function () {
  $('.brand-auto').infiniteslide({
    direction: 'left',
    speed: 50,
    clone: 15
  });
});

/**  Nav-menu JS  **/
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuItems = document.querySelector(".mobile-menu");
  const closeMenu = document.querySelector(".close-menu");

  if (menuBtn && menuOverlay && menuItems && closeMenu) {
    menuBtn.addEventListener("click", () => {
      menuOverlay.classList.add("show");
      menuItems.classList.add("open");
      document.body.classList.add("no-scroll");
    });

    [closeMenu, menuOverlay].forEach((el) => {
      if (!el) return; // prevent crash

      el.addEventListener("click", () => {
        menuOverlay.classList.remove("show");
        menuItems.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    });
  }
});

document.addEventListener("click", function (e) {
  const trigger = e.target.closest(".mobile-expand-drop");

  if (!trigger) return;

  e.preventDefault();
  e.stopPropagation();

  const parent = trigger.closest(".mobile-dropdown");
  const submenu = parent.querySelector(".mobile-dropdown-menu");

  if (!submenu) return;

  const isOpen = parent.classList.contains("active");

  // Close all
  document.querySelectorAll(".mobile-dropdown").forEach(item => {
    item.classList.remove("active");
    const menu = item.querySelector(".mobile-dropdown-menu");
    if (menu) menu.style.maxHeight = null;
  });

  // Open current if it was closed
  if (!isOpen) {
    parent.classList.add("active");
    submenu.style.maxHeight = submenu.scrollHeight + "px";
  }
});

/** Testimonials Section (Swiper) **/
var swiper1 = new Swiper(".testimonials-swiper", {
  slidesPerView: 3.3,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: ".testimonials-next",
    prevEl: ".testimonials-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    421: {
      slidesPerView: 1.2,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 16,
    },
    1200: {
      slidesPerView: 3.3,
      spaceBetween: 30,
    },
  },
});

gsap.to(".bg-parallax", {
  y: -100,
  ease: "none",
  scale: 1.1,
  scrollTrigger: {
    trigger: ".bl-video-4",
    start: "top center",
    end: "bottom top",
    scrub: true
  }
});

/** Footer Accordion JS **/
document.addEventListener("DOMContentLoaded", function () {

  function setupFooterAccordion() {
    const isMobile = window.innerWidth <= 767;
    const titles = document.querySelectorAll(".footer-title");

    titles.forEach((title) => {
      const content = title.nextElementSibling;

      if (!content) return;

      if (isMobile) {
        // Initial state
        gsap.set(content, {
          height: 0,
          overflow: "hidden"
        });

        title.classList.remove("active");

        if (title.dataset.bound !== "true") {
          title.addEventListener("click", function () {
            const isActive = title.classList.contains("active");

            // Close all
            titles.forEach((t) => {
              const c = t.nextElementSibling;
              t.classList.remove("active");

              if (c) {
                gsap.to(c, {
                  height: 0,
                  duration: 0.4,
                  ease: "power2.inOut"
                });
              }
            });

            // Open current
            if (!isActive) {
              title.classList.add("active");

              gsap.to(content, {
                height: content.scrollHeight,
                duration: 0.4,
                ease: "power2.inOut"
              });
            }
          });

          title.dataset.bound = "true";
        }

      } else {
        // Desktop reset
        title.classList.remove("active");

        gsap.set(content, {
          height: "auto",
          overflow: "visible"
        });
      }
    });
  }

  setupFooterAccordion();
  window.addEventListener("resize", setupFooterAccordion);
});



