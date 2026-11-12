/* Demo 1 js */

/**  Footer Accordion JS  **/
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

        if (!title.dataset.bound) {
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



