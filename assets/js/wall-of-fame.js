/**
 * IXG - Wall of Fame / Wall of Frames Interactive Script
 * Filtering, Lightbox Integration, Video Player Modal & OneDrive Auto-Sync
 */
document.addEventListener("DOMContentLoaded", function () {
  const fameGrid = document.getElementById("fameMasonryGrid");
  const filterNav = document.querySelector(".fame-filter-nav");

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 1. Filter Navigation Tabs Binder
  function bindFilters() {
    const filterBtns = document.querySelectorAll(".fame-filter-btn");

    filterBtns.forEach((btn) => {
      btn.onclick = function () {
        filterBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");
        const fameCards = document.querySelectorAll(".fame-card");

        fameCards.forEach((card) => {
          const categories = (card.getAttribute("data-category") || "").toLowerCase();

          if (filterValue === "all") {
            card.classList.remove("is-hidden");
          } else if (categories.includes(filterValue.toLowerCase())) {
            card.classList.remove("is-hidden");
          } else {
            card.classList.add("is-hidden");
          }
        });
      };
    });
  }

  // 2. Count Updater
  function updateCounts() {
    const allCards = document.querySelectorAll(".fame-card");
    const photoCards = document.querySelectorAll(".fame-card.photo-card");
    const videoCards = document.querySelectorAll(".fame-card.video-card");
    const awardCards = document.querySelectorAll(".fame-card[data-category*='awards']");

    const allBadge = document.getElementById("allCountBadge");
    const photoBadge = document.getElementById("photoCountBadge");
    const videoBadge = document.getElementById("videoCountBadge");
    const awardsBadge = document.getElementById("awardsCountBadge");
    const statsNum = document.getElementById("fameTotalStatsNum");

    if (allBadge) allBadge.textContent = allCards.length;
    if (photoBadge) photoBadge.textContent = photoCards.length;
    if (videoBadge) videoBadge.textContent = videoCards.length;
    if (awardsBadge) awardsBadge.textContent = awardCards.length;
    if (statsNum) statsNum.textContent = allCards.length + "+";
  }

  // 3. Init Fancybox Lightbox
  function initFancybox() {
    if (typeof $ !== "undefined" && $.fancybox) {
      $('[data-fancybox="wall-of-fame"]').fancybox({
        buttons: ["zoom", "slideShow", "fullScreen", "thumbs", "close"],
        animationEffect: "zoom",
        transitionEffect: "fade",
        loop: true,
        protect: true,
      });
    }
  }

  // 4. Video Modal Player Handlers
  function initVideoHandlers() {
    const modalVideoElement = document.getElementById("wallOfFameModalVideo");
    const modalVideoSource = document.getElementById("wallOfFameModalSource");
    const videoModal = document.getElementById("fameVideoModal");

    if (videoModal && modalVideoElement) {
      videoModal.addEventListener("hidden.bs.modal", function () {
        modalVideoElement.pause();
        modalVideoElement.currentTime = 0;
      });

      document.querySelectorAll(".open-video-modal").forEach((trigger) => {
        trigger.onclick = function (e) {
          e.preventDefault();
          const videoSrc = this.getAttribute("data-video-src");
          const videoTitle = this.getAttribute("data-video-title") || "Summit Video";

          const modalTitleEl = document.getElementById("fameVideoModalTitle");
          if (modalTitleEl) modalTitleEl.textContent = videoTitle;

          if (videoSrc && modalVideoSource) {
            modalVideoSource.setAttribute("src", videoSrc);
            modalVideoElement.load();
            modalVideoElement.play().catch(function (err) {
              console.log("Autoplay prevented:", err);
            });
          }
        };
      });
    }
  }

  // 5. OneDrive Auto-Sync Connector
  function syncOneDriveGallery() {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (!data.configured || !data.items || data.items.length === 0) {
          return;
        }

        if (!fameGrid) return;

        // Existing image src set
        const existingSources = new Set();
        document.querySelectorAll(".fame-card img").forEach((img) => {
          const src = img.getAttribute("src");
          if (src) existingSources.add(src);
        });

        let addedCount = 0;

        data.items.forEach((item) => {
          if (existingSources.has(item.url) || existingSources.has(item.thumbnail)) {
            return;
          }

          const card = document.createElement("div");
          const isVideo = item.type === "video";
          card.className = `fame-card ${isVideo ? "video-card" : "photo-card"}`;
          card.setAttribute("data-category", item.category || "photo");

          const badgeClass = item.isAward ? "award" : (isVideo ? "video" : "photo");
          const badgeIcon = item.isAward ? "ri-trophy-fill" : (isVideo ? "ri-film-fill" : "ri-camera-fill");
          const badgeLabel = item.isAward ? "AWARDS" : (isVideo ? "VIDEO REEL" : "PHOTO");
          const locationText = item.category?.includes("dubai")
            ? "Dubai, UAE"
            : item.category?.includes("india")
            ? "India Edition"
            : "Executive Summit";

          const mediaLink = isVideo
            ? `<a href="javascript:void(0)" class="open-video-modal" data-bs-toggle="modal" data-bs-target="#fameVideoModal" data-video-src="${item.url}" data-video-title="${escapeHtml(item.title)}">
                 <img src="${item.thumbnail || item.url}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
                 <div class="fame-video-play-wrap"><div class="fame-play-pulse-btn"><i class="ri-play-fill"></i></div></div>
               </a>`
            : `<a href="${item.url}" data-fancybox="wall-of-fame" data-caption="${escapeHtml(item.title)}">
                 <img src="${item.thumbnail || item.url}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
                 <div class="fame-overlay-zoom"><div class="fame-zoom-icon"><i class="ri-zoom-in-line"></i></div></div>
               </a>`;

          const actionLink = isVideo
            ? `<a href="javascript:void(0)" class="fame-card-link open-video-modal" data-bs-toggle="modal" data-bs-target="#fameVideoModal" data-video-src="${item.url}" data-video-title="${escapeHtml(item.title)}">Play Video <i class="ri-play-circle-fill"></i></a>`
            : `<a href="${item.url}" data-fancybox="wall-of-fame" data-caption="${escapeHtml(item.title)}" class="fame-card-link">View Full Size <i class="ri-arrow-right-line"></i></a>`;

          card.innerHTML = `
            <div class="fame-media-box">
              <span class="fame-badge-type ${badgeClass}"><i class="${badgeIcon}"></i> ${badgeLabel}</span>
              <span class="fame-badge-loc"><i class="ri-map-pin-line"></i> ${locationText}</span>
              ${mediaLink}
            </div>
            <div class="fame-card-body">
              <span class="fame-card-tag">${item.isAward ? "Executive Award" : (item.folder || "Summit Moment")}</span>
              <h4 class="fame-card-title">${escapeHtml(item.title)}</h4>
              <div class="fame-card-meta">
                <span><i class="ri-cloud-line"></i> Cloud Synced</span>
                ${actionLink}
              </div>
            </div>
          `;

          fameGrid.insertBefore(card, fameGrid.firstChild);
          addedCount++;
        });

        if (addedCount > 0) {
          updateCounts();
          bindFilters();
          initFancybox();
          initVideoHandlers();
        }
      })
      .catch((err) => {
        console.log("OneDrive Gallery Sync Notice:", err);
      });
  }

  // 6. Mobile Menu Drawer
  var menuBtn = document.querySelector(".menu-btn");
  var menuOverlay = document.querySelector(".menu-overlay");
  var mobileMenu = document.querySelector(".mobile-menu");
  var closeMenu = document.querySelector(".close-menu");

  if (menuBtn && menuOverlay && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      menuOverlay.classList.add("show");
      mobileMenu.classList.add("open");
      document.body.classList.add("no-scroll");
    });

    [closeMenu, menuOverlay].forEach(function (el) {
      if (el) {
        el.addEventListener("click", function () {
          menuOverlay.classList.remove("show");
          mobileMenu.classList.remove("open");
          document.body.classList.remove("no-scroll");
        });
      }
    });

    document.querySelectorAll(".mobile-menu .mobile-menu-item").forEach(function (link) {
      link.addEventListener("click", function () {
        menuOverlay.classList.remove("show");
        mobileMenu.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  // Initial runs
  bindFilters();
  updateCounts();
  initFancybox();
  initVideoHandlers();
  syncOneDriveGallery();
});
