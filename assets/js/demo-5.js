/* Demo 5 js */

/* Podcast slider */
$(function () {
  $('.podcast-auto, .keyword-auto').infiniteslide({
    direction: 'left',
    speed: 40,
    clone: 15
  });
});

/* Hero Images Rotation & Hover */
const boxes = document.querySelectorAll('.hero-box');
if (boxes.length > 0) {
  let currentIndex = 0;
  let interval;

  const setActive = (index) => {
    boxes.forEach(box => box.classList.remove('active'));
    boxes[index].classList.add('active');
    currentIndex = index;
  };

  const autoChange = () => {
    currentIndex = (currentIndex + 1) % boxes.length;
    setActive(currentIndex);
  };

  // Init first active
  setActive(0);

  // Start auto rotation
  const startInterval = () => {
    if (interval) clearInterval(interval);
    interval = setInterval(autoChange, 5000);
  };

  const stopInterval = () => {
    clearInterval(interval);
  };

  startInterval();

  // Hover functionality
  boxes.forEach((box, index) => {
    box.addEventListener('mouseenter', () => {
      stopInterval();       // stop auto when hover
      setActive(index);     // set hovered active
    });

    box.addEventListener('mouseleave', () => {
      startInterval();      // resume auto when leave
    });
  });
}

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
/** Upcoming Events Slider (Slides one by one with smooth animations) **/
if (document.querySelector(".ixg-events-swiper")) {
  var eventsSwiper = new Swiper(".ixg-events-swiper", {
    slidesPerView: 1.15,
    slidesPerGroup: 1, // Slides exactly one by one!
    spaceBetween: 20,
    loop: true,
    speed: 800, // Silky smooth animation transition
    grabCursor: true,
    watchSlidesProgress: true,
    autoplay: {
      delay: 3600,
      disableOnInteraction: false,
      pauseOnMouseEnter: true, // Pauses on hover so user can read/interact
    },
    navigation: {
      nextEl: ".ixg-nav-next",
      prevEl: ".ixg-nav-prev",
    },
    pagination: {
      el: ".ixg-events-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '"></span>';
      },
    },
    breakpoints: {
      480: {
        slidesPerView: 1.35,
        slidesPerGroup: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1.85,
        slidesPerGroup: 1,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 2.1,
        slidesPerGroup: 1,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 2.35,
        slidesPerGroup: 1,
        spaceBetween: 26,
      },
      1400: {
        slidesPerView: 2.5,
        slidesPerGroup: 1,
        spaceBetween: 28,
      },
    },
  });
}

/** Review Slider **/
var swiper = new Swiper(".testimonials-swiper", {
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

/* YouTube Background Video Responsiveness Sizing */
function resizeYoutubeBackground() {
  const iframe = document.querySelector('#yt-bg-player');
  if (!iframe) return;

  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  const aspectRatio = 16 / 9;

  // Scale dimensions to always cover the viewport (behaves like background-size: cover)
  const newWidth = Math.max(containerWidth, containerHeight * aspectRatio);
  const newHeight = newWidth / aspectRatio;

  iframe.style.width = `${newWidth}px`;
  iframe.style.height = `${newHeight}px`;
}

// Bind load, DOMContentLoaded, and resize events to keep size up to date
document.addEventListener("DOMContentLoaded", resizeYoutubeBackground);
window.addEventListener("load", resizeYoutubeBackground);
window.addEventListener("resize", resizeYoutubeBackground);

// Load YouTube IFrame Player API dynamically
(function () {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

var player;
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('yt-bg-player', {
    videoId: 'TA8vSIzkBRE',
    playerVars: {
      'autoplay': 1,
      'mute': 1,
      'controls': 0,
      'showinfo': 0,
      'rel': 0,
      'loop': 1,
      'playlist': 'TA8vSIzkBRE',
      'iv_load_policy': 3,
      'playsinline': 1,
      'autohide': 1,
      'modestbranding': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  event.target.mute();
  event.target.playVideo();
  resizeYoutubeBackground();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    if (player) {
      player.seekTo(0);
      player.playVideo();
    }
  }
}

/* Rolling Statistics Counter JS */
window.addEventListener("load", function () {
  const counters = document.querySelectorAll(".count-num");
  if (!counters.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetStr = entry.target.getAttribute("data-target");

        // Setup DOM for rolling
        entry.target.innerHTML = '';
        entry.target.style.display = 'inline-flex';
        entry.target.style.overflow = 'hidden';
        entry.target.style.lineHeight = '1';
        entry.target.style.verticalAlign = 'bottom';
        entry.target.style.height = '1em'; // Ensure it only shows one digit at a time

        const chars = targetStr.split('');

        chars.forEach((char, index) => {
          const digit = document.createElement('span');
          digit.style.display = 'inline-block';

          const inner = document.createElement('span');
          inner.style.display = 'block';
          // Delay each digit slightly for a nice staggered effect, making it slower overall
          inner.style.transition = `transform ${3.0 + (index * 0.6)}s cubic-bezier(0.2, 0.8, 0.2, 1)`;

          let html = '';
          // Two sets of 0-9 for a good rolling effect
          for (let i = 0; i <= 9; i++) {
            html += `<span style="display:block; height: 1em;">${i}</span>`;
          }
          for (let i = 0; i <= 9; i++) {
            html += `<span style="display:block; height: 1em;">${i}</span>`;
          }
          // The target digit
          html += `<span style="display:block; height: 1em;">${char}</span>`;

          inner.innerHTML = html;
          digit.appendChild(inner);
          entry.target.appendChild(digit);

          // Trigger the animation
          // total spans = 21. index of target is 20.
          requestAnimationFrame(() => {
            // Need a slight delay to ensure transition applies
            setTimeout(() => {
              inner.style.transform = `translateY(-${(20 / 21) * 100}%)`;
            }, 50);
          });
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
});
