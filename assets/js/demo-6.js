/* Demo 6 js */

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
var swiper1 = new Swiper(".testimonials-swiper-6", {
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
 /** Footer Interactive Button **/
  const btn = document.querySelector(".footer-round-6 span");
  const container = document.querySelector(".footer-middle-content");
  if (btn && container) {
    let centerX = container.offsetWidth / 2;

    const updateCenter = () => (centerX = container.offsetWidth / 2);
    window.addEventListener("resize", updateCenter);

    container.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX - container.getBoundingClientRect().left;
      const moveX = (mouseX - centerX) * 0.3;

      gsap.to(btn, { x: moveX, duration: 0.3, ease: "power2.out" });
    });

    container.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, duration: 0.5, ease: "power2.out" });
    });
  }



