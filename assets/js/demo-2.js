/* Demo 2 js */

/* Menu toggle */
// Select the menu button and the menu itself
const menuBtn = document.querySelector(".toggle-btn");
const menu = document.querySelector(".bl-sidebar-2");
const bloverlay = document.querySelector(".bl-sidebar-2-overlay");
const blclose = document.querySelector(".bl-btn-close");

if (menuBtn && menu && blclose && bloverlay) {
  menuBtn.addEventListener("click", () => {
    menu.classList.add("active"); // toggle the active class
    bloverlay.classList.add("active"); // optionally toggle button appearance
  });
  function closeMenu() {
    menu.classList.remove("active");
    bloverlay.classList.remove("active");
  }
  blclose.addEventListener("click", closeMenu);
  bloverlay.addEventListener("click", closeMenu);
}




