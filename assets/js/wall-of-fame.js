/**
 * IXG - Wall of Fame / Wall of Frames Interactive Script
 * Filtering, Lightbox Integration & Video Player Modal
 */
document.addEventListener("DOMContentLoaded", function () {
  // 1. Filter Navigation Tabs
  const filterBtns = document.querySelectorAll(".fame-filter-btn");
  const fameCards = document.querySelectorAll(".fame-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Toggle active class
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      fameCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";

        if (filterValue === "all") {
          card.classList.remove("is-hidden");
        } else if (categories.includes(filterValue)) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // 2. Video Modal Player Handlers
  const videoCards = document.querySelectorAll(".fame-card.video-card");
  const modalVideoElement = document.getElementById("wallOfFameModalVideo");
  const modalVideoSource = document.getElementById("wallOfFameModalSource");
  const videoModal = document.getElementById("fameVideoModal");

  if (videoModal && modalVideoElement) {
    // When video modal is closed, pause video
    videoModal.addEventListener("hidden.bs.modal", function () {
      modalVideoElement.pause();
      modalVideoElement.currentTime = 0;
    });

    // When a video card is clicked with custom trigger
    videoCards.forEach((card) => {
      const playTrigger = card.querySelector(".open-video-modal");
      if (playTrigger) {
        playTrigger.addEventListener("click", function (e) {
          e.preventDefault();
          const videoSrc = this.getAttribute("data-video-src");
          const videoTitle = this.getAttribute("data-video-title") || "Summit Video";
          
          const modalTitleEl = document.getElementById("fameVideoModalTitle");
          if (modalTitleEl) {
            modalTitleEl.textContent = videoTitle;
          }

          if (videoSrc && modalVideoSource) {
            modalVideoSource.setAttribute("src", videoSrc);
            modalVideoElement.load();
            modalVideoElement.play().catch(function (err) {
              console.log("Autoplay prevented:", err);
            });
          }
        });
      }
    });
  }

  // 3. Fancybox Lightbox configuration
  if (typeof $ !== "undefined" && $.fancybox) {
    $('[data-fancybox="wall-of-fame"]').fancybox({
      buttons: ["zoom", "slideShow", "fullScreen", "thumbs", "close"],
      animationEffect: "zoom",
      transitionEffect: "fade",
      loop: true,
      protect: true,
    });
  }
});

