"use strict";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
/*  Smooth scroller (Desktop smooth, Mobile native 120Hz/60Hz momentum)  */
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 992);

let smoother = null;
if (!isTouchDevice && typeof ScrollSmoother !== "undefined") {
  smoother = ScrollSmoother.create({
    wrapper: "#wrapper",
    content: "#content",
    smooth: 1.0,
    speed: 1,
    effects: true,
    smoothTouch: false,
    normalizeScroll: false
  });
}
window.smoother = smoother;

/* Smooth in-page anchor navigation */
document.addEventListener("click", function(e) {
  const link = e.target.closest('a[href*="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.startsWith('javascript:')) return;
  
  let targetSelector = null;
  if (href.startsWith('#')) {
    targetSelector = href;
  } else {
    try {
      const url = new URL(link.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        targetSelector = url.hash;
      }
    } catch (err) {}
  }
  
  if (targetSelector && targetSelector.length > 1) {
    const targetEl = document.querySelector(targetSelector);
    if (targetEl) {
      e.preventDefault();
      if (window.history && window.history.pushState) {
        window.history.pushState(null, null, targetSelector);
      }
      if (window.smoother) {
        window.smoother.scrollTo(targetEl, true, "top 75px");
      } else {
        const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 75;
        window.scrollTo({ top: topPos, behavior: "smooth" });
      }
    }
  }
});

/* Auto-scroll to hash on initial load */
if (window.location.hash) {
  window.addEventListener("load", function() {
    setTimeout(function() {
      const targetEl = document.querySelector(window.location.hash);
      if (targetEl) {
        if (window.smoother) {
          window.smoother.scrollTo(targetEl, true, "top 75px");
        } else {
          const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 75;
          window.scrollTo({ top: topPos, behavior: "smooth" });
        }
      }
    }, 350);
  });
}

/*  Hero Image  */
if (smoother) {
  smoother.effects(".hero-image-cont", {
    speed: () => gsap.utils.random(0.55, 0.85, 0.05)
  });
}

const elements = document.querySelectorAll(".anim-swipe");

if (elements.length > 0) {
  gsap.to(elements, {
    yPercent: 300,
    delay: 0.2,
    duration: 3,
    stagger: {
      from: "random",
      each: 0.1
    },
    ease: "sine.out"
  });
}

// ----------------------------------------
//  Split text on title(name) hero section
// ----------------------------------------
// Set initial opacity
const nameEl = document.querySelector(".name");
const triggerEl = document.querySelector(".hero-details");

if (nameEl && triggerEl && typeof SplitText !== "undefined") {
  
  gsap.set(nameEl, { opacity: 1 });

  let split = SplitText.create(nameEl, {
    type: "chars"
  });

  gsap.from(split.chars, {
    x: 20,
    autoAlpha: 0,
    stagger: 0.05,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: triggerEl,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}
// Select all target text elements for animation
const textRevealTargets = document.querySelectorAll('.title h2, .title-3 h2, .bl-page-title, .hire-title, .bl-loader span');

// Loop through each element and apply animation
textRevealTargets.forEach((textElement) => {

  // Clean up any existing animation and revert split
  if (textElement._gsapAnim) {
    textElement._gsapAnim.progress(1).kill();
    textElement._splitInstance.revert();
  }

  // Create new SplitText instance
  const splitInstance = new SplitText(textElement, {
    type: "lines, words, chars",
    linesClass: "split-line"
  });

  // Store for later cleanup if needed
  textElement._splitInstance = splitInstance;

  // Set initial perspective and character styles
  gsap.set(textElement, { perspective: 500 });
  gsap.set(splitInstance.chars, {
    opacity: 0,
    x: 50
  });

  // Animate characters when scrolled into view
  const revealAnim = gsap.to(splitInstance.chars, {
    scrollTrigger: {
      trigger: textElement,
      start: "top 90%",
      markers: false
    },
    x: 0,
    y: 0,
    rotateX: 0,
    opacity: 1,
    duration: 1,
    ease: "back.out(1.7)",
    stagger: 0.02
  });

  // Store animation on element for potential cleanup
  textElement._gsapAnim = revealAnim;
});

//  Split text on designation hero section
var vsOpts = {
  slides: document.querySelectorAll('.bl-slide'),
  list: document.querySelector('.bl-slides'),
  duration: 0.3,
  lineHeight: 25
}

var vSlide = gsap.timeline({
  paused: true,
  repeat: -1
});

vsOpts.slides.forEach(function (slide, i) {
  // Create a label
  let label = "slide" + i;
  vSlide.add(label);

  let letters = new SplitText(slide, { type: "chars" }).chars;

  // Move the whole word
  if (i > 0) {
    vSlide.to(vsOpts.list, {
      duration: vsOpts.duration,
      y: i * -1 * vsOpts.lineHeight
    }, label);

    // Move each letter
    vSlide.from(letters, {
      duration: vsOpts.duration,
      y: 50,
      stagger: vsOpts.duration / 10
    }, label);
  }

  if (i < vsOpts.slides.length - 1) {
    vSlide.to(letters, {
      duration: vsOpts.duration,
      y: -50,
      stagger: vsOpts.duration / 10
    }, "+=1");
  }
})
vSlide.play();

/*  Buttons  */
const button = document.querySelector('a.bl-btn-1');

if (button) {
  button.addEventListener('mousemove', function (evt) {
    const movX = evt.clientX - this.getBoundingClientRect().x;
    gsap.to(".bl-btn-spotlight", {
      x: movX,
      scale: 20,
      duration: 0.3
    });
  });

  button.addEventListener('mouseleave', function (evt) {
    const movX = evt.clientX - this.getBoundingClientRect().x;
    gsap.to(".bl-btn-spotlight", {
      x: movX,
      scale: 0,
      duration: 0.3
    });
  });
}

// Text reveal on scroll hero section
const splittxt = new SplitText(".bl-here-txt p", { type: "lines" });

splittxt.lines.forEach((target) => {
  gsap.to(target, {
    backgroundPositionX: 0,
    ease: "none",
    scrollTrigger: {
      trigger: target,
      markers: false,
      scrub: 1,
      start: "top center",
      end: "bottom center"
    }
  });
});

/*  Reveal text demo 4  */
const text = document.querySelector(".reveal_bg");

if (text) {
  let words = text.textContent.split(" "); // ✅ split by word

  text.innerHTML = words
    .map(word => `<span class="word">${word}</span>`)
    .join(" "); // keep spaces between words

  const wordSpans = text.querySelectorAll(".word");

  gsap.to(wordSpans, {
    opacity: 1,
    stagger: .3, // slower than characters (adjust feel)
    ease: "none",
    scrollTrigger: {
      trigger: ".bl-here-txt",
      start: "top center",
      end: "bottom center",
      scrub: true,
      // markers: true
    }
  });
}
const text2 = document.querySelector(".reveal_bg_text");

if (text2) {
  function wrapWords(node) {
    if (node.nodeType === 3) { // text node
      const words = node.textContent.split(" ");
      return words.map(word => {
        if (word.trim() === "") return " ";
        return `<span class="word2">${word}</span>`;
      }).join(" ");
    }

    if (node.nodeType === 1) { // element node
      let childrenHTML = "";
      node.childNodes.forEach(child => {
        childrenHTML += wrapWords(child);
      });
      return `<${node.tagName.toLowerCase()} class="${node.className}">${childrenHTML}</${node.tagName.toLowerCase()}>`;
    }

    return "";
  }

  text2.innerHTML = wrapWords(text2);

  const wordSpans = text2.querySelectorAll(".word2");

  gsap.to(wordSpans, {
    opacity: 1,
    stagger: 0.03,
    duration: 0.6,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".bl-abt-txt",
      start: "top center",
      end: "bottom center",
      scrub: true,
    }
  });
}

/*  Hero shape animation on scroll  */
gsap.utils.toArray('.bl-parallax-2').forEach(wrap => {
  const y = wrap.getAttribute('data-y') || -200;

  gsap.to(wrap, {
    y: y,
    scrollTrigger: {
      trigger: wrap,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.1,
    }
  })
});

gsap.utils.toArray('.bl-parallax').forEach(wrap => {
  const y = wrap.getAttribute('data-y') || -200;

  // Parallax scroll effect
  gsap.to(wrap, {
    y: y,
    scrollTrigger: {
      trigger: wrap,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.1,
    }
  });

  // Infinite rotation (independent from scroll)
  gsap.to(wrap, {
    rotation: 360,
    duration: 20,   // speed of rotation
    ease: "linear",
    repeat: -1      // infinite
  });
});

/*  Cursor animation  */
class bl_Cursor {
  constructor(opts = {}) {
    // Default settings
    this.settings = Object.assign(
      {
        container: "body",
        speed: 0.6,
        ease: "power3.out",
        visibleDelay: 250,
      },
      opts
    );
    // Elements
    this.$root = document.querySelector(this.settings.container);
    this.$cursor = document.createElement("div");
    this.$cursor.className = "bl-cursor";
    this.$cursorText = document.createElement("div");
    this.$cursorText.className = "bl-cursor-text";
    this.$cursor.appendChild(this.$cursorText);
    this.$cursorImg = document.createElement("div");
    this.$cursorImg.className = "bl-cursor-img";
    this.$cursor.appendChild(this.$cursorImg);
    this.$root.appendChild(this.$cursor);

    // State
    this.pos = { x: -9999, y: -9999 };
    this.isVisible = false;

    // Init
    this.bindEvents();
    this.moveInstant();

    window.addEventListener(
      "mousemove",
      () => {
        cursor.show();
      },
      { once: true }
    );
  }

  // --------------------
  // Core Methods
  // --------------------
  bindEvents() {
    this.$root.addEventListener("mouseenter", () => this.show());
    this.$root.addEventListener("mouseleave", () => this.hide());
    this.$root.addEventListener("mousemove", (e) => this.trackPosition(e));
    this.$root.addEventListener("mousedown", () =>
      this.toggleState("active", true)
    );
    this.$root.addEventListener("mouseup", () =>
      this.toggleState("active", false)
    );

    // Interactive elements
    this.hoverState("iframe, input , textarea, a", null, { hide: true });
    this.hoverDataAttr("[data-cursor]", "state");
    this.hoverDataAttr("[data-cursor-text]", "text");
    this.hoverDataAttr("[data-cursor-img]", "hover-img");
  }

  trackPosition(e) {
    this.pos.x = e.clientX;
    this.pos.y = e.clientY;
    this.bl_render();
  }

  bl_render(x, y, duration) {
    gsap.to(this.$cursor, {
      x: x ?? this.pos.x,
      y: y ?? this.pos.y,
      duration: this.isVisible ? duration ?? this.settings.speed : 0,
      ease: this.settings.ease,
      overwrite: true,
      force3D: true,
    });
  }

  moveInstant() {
    this.bl_render(-window.innerWidth, -window.innerHeight, 0);
  }

  // --------------------
  // State Controls
  // --------------------
  toggleState(name, enable) {
    this.$cursor.classList.toggle(`${name}`, enable);
  }

  setText(value) {
    this.$cursorText.innerHTML = value;
    this.toggleState("text", true);
  }

  clearText() {
    this.toggleState("text", false);
  }

  setImg(value) {
    this.$cursorImg.innerHTML = `<img src="${value}" alt="cursor image">`;
    this.toggleState("hover-img", true);
  }

  clearImg() {
    this.toggleState("hover-img", false);
  }

  // --------------------
  // Show / Hide
  // --------------------
  show() {
    if (this.isVisible) return;
    this.$cursor.classList.add("cursor-show");
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => (this.isVisible = true));
  }

  hide() {
    this.$cursor.classList.remove("cursor-show");
    clearTimeout(this._timeout);
    this._timeout = setTimeout(
      () => (this.isVisible = false),
      this.settings.visibleDelay
    );
  }

  // --------------------
  // Helpers
  // --------------------
  hoverState(selector, state, opts = {}) {
    this.$root.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (opts.hide) return this.hide();
        if (state) this.toggleState(state, true);
      });
      el.addEventListener("mouseleave", () => {
        if (opts.hide) return this.show();
        if (state) this.toggleState(state, false);
      });
    });
  }

  hoverDataAttr(selector, type) {
    this.$root.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (type === "state") this.toggleState(el.dataset.cursor, true);
        if (type === "text") this.setText(el.dataset.cursorText);
        if (type === "hover-img") this.setImg(el.dataset.cursorImg);
      });
      el.addEventListener("mouseleave", () => {
        if (type === "state") this.toggleState(el.dataset.cursor, false);
        if (type === "text") this.clearText();
        if (type === "hover-img") this.clearImg();
      });
    });
  }
}
// Init
const cursor = new bl_Cursor();

/*  About image  */
const aboutProfile = document.querySelector(".about-profile");
const office = document.querySelector(".office");
const trigger = document.querySelector(".clusterGreat");

if (aboutProfile || office) {

  if (aboutProfile) {
    gsap.set(aboutProfile, { yPercent: 10 });

    gsap.to(aboutProfile, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        scrub: 1
      }
    });
  }

  if (office) {
    gsap.set(office, { yPercent: -20 });

    gsap.to(office, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        scrub: 1
      }
    });
  }
}

/*  Blog section  */
const images = document.querySelectorAll(".bl-blog-box .blog-img img");
const blogtrigger = document.querySelector(".bl-blog-box");

if (images.length > 0 && blogtrigger) {
  gsap.fromTo(images,
    {
      scale: 1
    },
    {
      scale: 1.2,
      scrollTrigger: {
        trigger: blogtrigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    }
  );
}

/*  Episode 5 section  */
const episodeimages = document.querySelectorAll(".bl-episode-img img");
const episodetrigger = document.querySelector(".bl-episode-listing");

if (episodeimages.length > 0 && episodetrigger) {
  gsap.fromTo(episodeimages,
    {
      scale: 1.4,
    },
    {
      scale: 1,
      scrollTrigger: {
        trigger: episodetrigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    }
  );
}

window.addEventListener("load", () => {

  /* Page intro hero */
  const introEl = document.querySelector(".bl-intro-sec");

if (introEl) {
  gsap.to(introEl, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out"
  });
}

  /* Experience Timeline */
  const timeline = document.querySelector(".experience-timeline");
  const line = document.querySelector(".experience-line");
  const listItems = gsap.utils.toArray(".experience-list li");

  // Only run if all necessary elements exist
  if (timeline && line && listItems.length > 0) {

    gsap.set(line, { height: 0 });

    listItems.forEach((li) => {
      const dot = li.querySelector(".dot");
      const liTop = li.offsetTop + li.offsetHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: li,
          start: "top 80%",
          end: "top 60%",
          toggleActions: "play none none none",
        },
      });

      tl.to(dot, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" })
        .to(li, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.6")
        .to(line, { height: liTop, duration: 1, ease: "power1.out" }, "-=0.8");
    });

  }

});

/** Service 3 Section **/
const serviceImgBox = document.querySelector(".bl-service-img");

if (serviceImgBox) {
  const img = serviceImgBox.querySelector("img");
  const serviceList = document.querySelector(".bl-service-list");
  const serviceItems = document.querySelectorAll(".bl-service-list li");

  function ensurePositioning() {
    const boxStyles = getComputedStyle(serviceImgBox);
    if (boxStyles.position === "static") {
      serviceImgBox.style.position = "relative";
    }
    img.style.position = "absolute";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, 0) rotate(3deg)";
    img.style.transition = "transform 300ms ease";
  }

  function placeImageAtItem(item) {
    const listRect = serviceList.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const relativeTop = itemRect.top - listRect.top;

    let desiredTop =
      relativeTop + itemRect.height / 2 - imgRect.height / 2;

    const maxTop = Math.max(0, listRect.height - imgRect.height);
    const clampedTop = Math.max(0, Math.min(desiredTop, maxTop));

    img.style.transform = `translate(-50%, ${Math.round(
      clampedTop
    )}px) rotate(3deg)`;
  }

  ensurePositioning();

  serviceItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const newImage = item.dataset.image;

      if (newImage) img.src = newImage;

      if (!img.complete) {
        img.addEventListener("load", () => placeImageAtItem(item), {
          once: true,
        });
      } else {
        placeImageAtItem(item);
      }
    });
  });

  window.addEventListener("resize", () => {
    const hovered = document.querySelector(".bl-service-list li:hover");
    if (hovered) placeImageAtItem(hovered);
  });

  const mo = new MutationObserver(() => {
    const hovered = document.querySelector(".bl-service-list li:hover");
    if (hovered) placeImageAtItem(hovered);
  });

  mo.observe(serviceList, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

/** Team Section **/
const teamList = document.querySelector(".bl-team-content");

if (teamList) {
  const teamItems = teamList.querySelectorAll("li");

  if (teamItems.length > 0) {

    let lastActiveIndex = 0;

    function resetImages() {
      teamItems.forEach((li) => {
        const img = li.querySelector(".bl-team-box img");
        if (!img) return;

        gsap.to(img, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        });
      });
    }

    teamItems.forEach((li, index) => {
      const box = li.querySelector(".bl-team-box");
      const img = box?.querySelector("img");

      if (!box || !img) return; // ✅ important check

      box.addEventListener("mouseenter", () => {
        teamItems.forEach((item) => item.classList.remove("active"));
        li.classList.add("active");
        lastActiveIndex = index;

        gsap.to(img, {
          scale: 1.08,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      box.addEventListener("mousemove", (e) => {
        const rect = box.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;

        gsap.to(img, {
          x,
          y,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      box.addEventListener("mouseleave", () => {
        gsap.to(img, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        });
      });
    });

    teamList.addEventListener("mouseleave", () => {
      teamItems.forEach((item) => item.classList.remove("active"));

      if (teamItems[lastActiveIndex]) {
        teamItems[lastActiveIndex].classList.add("active");
      }

      resetImages();
    });

    // Default active
    teamItems[0].classList.add("active");
  }
}

/** About 3, 5 Section **/
const abtElement = document.querySelector(".abt-img");
const abouttrigger = document.querySelector(".bl-about-3, .bl-about-5");

if (abtElement && abouttrigger) {
  gsap.fromTo(abtElement,
    { clipPath: "inset(0 100% 0 0)", scale: 1.1, opacity: 0.5 },
    {
      clipPath: "inset(0 0% 0 0)",
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: abouttrigger,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );
}

/** Hero 3 Section **/
const heroElement = document.querySelector(".bl-img-box");
const herotrigger = document.querySelector(".bl-hero-3");

if (heroElement && herotrigger) {
  gsap.fromTo(heroElement,
    { clipPath: "inset(0 100% 0 0)", scale: 1.1, opacity: 0.5 },
    {
      clipPath: "inset(0 0% 0 0)",
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: herotrigger,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );
}
/** Hero 6 Section **/
gsap.to(".hero-img-6", {
  y: 200, // moves image DOWN while scrolling
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-img-6",
    start: "top bottom",   // when image enters viewport
    end: "bottom top",     // until it leaves
    scrub: true            // smooth scroll-based movement
  }
});
const heroImg6 = document.querySelector(".bl-name-6");

window.addEventListener("mousemove", (e) => {
  let x = (e.clientX / window.innerWidth - 0.5) * 100; // horizontal movement
  let y = (e.clientY / window.innerHeight - 0.5) * 100; // vertical movement

  gsap.to(heroImg6, {
    x: x,
    y: y,
    duration: 0.5,
    ease: "power2.out"
  });
});
/** Project 3 Section **/
const projectItems = document.querySelectorAll(".bl-project-wrapper");

projectItems.forEach((item, index) => {
  const img = item.querySelector(".bl-anim-box");

  const xStart = index % 2 === 0 ? -80 : 80;
  const yStart = 80;
  const scaleStart = 0.85;

  gsap.fromTo(
    img,
    { x: xStart, y: yStart, scale: scaleStart, opacity: 0 },
    {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      ease: "power1.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        end: "top 20%",
        scrub: 0.6,
      },
    }
  );
});

document.querySelectorAll(".bl-project-img").forEach((box) => {
  const img = box.querySelector("img");

  box.addEventListener("mouseleave", () => {
    gsap.to(img, {
      scale: 1,
      duration: 0.6,
      ease: "power2.inOut",
    });
  });
});

/** Portfolio 6 (Horizontal Scroll) **/
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".bl-portfolio-wrapper");
  if (wrapper) {
    const wrapperWidth = wrapper.scrollWidth;
    const windowWidth = window.innerWidth;
    const scrollDistance = wrapperWidth - windowWidth;

    gsap.to(wrapper, {
      x: () => `-${scrollDistance}px`,
      ease: "none",
      scrollTrigger: {
        trigger: ".bl-portfolio-block",
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }
});

/** Video Section 6 **/
  const videoEl = document.querySelector(".bl-video-6 video");

  if (videoEl) {
    gsap.fromTo(
      videoEl,
      { clipPath: "circle(0% at 50% 50%)" },
      {
        clipPath: "circle(150% at 50% 50%)",
        ease: "none",
        scrollTrigger: {
          trigger: ".bl-video-6",
          start: "top 70%",
          end: "bottom 60%",
          scrub: true,
        },
      }
    );
  }

// Service demo 4
const tboxes = document.querySelectorAll(".service-box-4");

tboxes.forEach((boxa, i) => {
  gsap.to(boxa, {
    scale: 1 - (tboxes.length - i) * 0.05,
    opacity: 1 - (tboxes.length - i) * 0.1,
    scrollTrigger: {
      trigger: boxa,
      start: "top+100px",
      end: "bottom top",
      scrub: true,
    }
  });
});

/**  Project Image 4 Reveal (GSAP)  */
gsap.utils.toArray(".project-box-4 img").forEach((img) => {
  gsap.fromTo(
    img,
    {
      clipPath: "inset(0 100% 0 0)",
      scale: 1.1,
      opacity: 0.5,
    },
    {
      clipPath: "inset(0 0% 0 0)",
      scale: 1.1,
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: img,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );
});

/**  Project Parallax 4  */
  const projectTriggers = [];

  gsap.utils.toArray(".project-box-4 img").forEach(card => {
    const tween = gsap.to(card, {
      scale: 1.5,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top center",
        end: "bottom top",
        scrub: true,
        // markers: true
      }
    });

    // Store ScrollTrigger instance
    projectTriggers.push(tween.scrollTrigger);
  });

  /** Achievements 4 Section **/
const achieveImgBox = document.querySelector(".bl-achievements-img");

if (achieveImgBox) {
  const img = achieveImgBox.querySelector("img");
  const serviceList = document.querySelector(".bl-achievements-list");
  const serviceItems = document.querySelectorAll(".bl-achievements-list li");

  function ensurePositioning() {
    const boxStyles = getComputedStyle(achieveImgBox);
    if (boxStyles.position === "static") {
      achieveImgBox.style.position = "relative";
    }
    img.style.position = "absolute";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, 0) rotate(3deg)";
    img.style.transition = "transform 300ms ease";
  }

  function placeImageAtItem(item) {
    const listRect = serviceList.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const relativeTop = itemRect.top - listRect.top;

    let desiredTop =
      relativeTop + itemRect.height / 2 - imgRect.height / 2;

    const maxTop = Math.max(0, listRect.height - imgRect.height);
    const clampedTop = Math.max(0, Math.min(desiredTop, maxTop));

    img.style.transform = `translate(-50%, ${Math.round(
      clampedTop
    )}px) rotate(3deg)`;
  }

  ensurePositioning();

  serviceItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const newImage = item.dataset.image;

      if (newImage) img.src = newImage;

      if (!img.complete) {
        img.addEventListener("load", () => placeImageAtItem(item), {
          once: true,
        });
      } else {
        placeImageAtItem(item);
      }
    });
  });

  window.addEventListener("resize", () => {
    const hovered = document.querySelector(".bl-achievements-list li:hover");
    if (hovered) placeImageAtItem(hovered);
  });

  const mo = new MutationObserver(() => {
    const hovered = document.querySelector(".bl-achievements-list li:hover");
    if (hovered) placeImageAtItem(hovered);
  });

  mo.observe(serviceList, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

let mm = gsap.matchMedia();
mm.add("(min-width: 992px)", () => {

  // Sidebar ScrollTrigger
  const sidebarElement = document.querySelector(".bl-resume-sidebar");
const endTrigger = document.querySelector(".bl-sticky-wrapper");

if (sidebarElement && endTrigger) {
  gsap.to(sidebarElement, {
    scrollTrigger: {
      trigger: sidebarElement,
      start: "top-=24px top",
      endTrigger: endTrigger,
      pin: true,
      pinSpacing: false,
      markers: false,
      invalidateOnRefresh: true,
    },
  });
}

  // Testimonials demo 3
  const tboxes = document.querySelectorAll(".bl-testimonials-box");

if (tboxes.length) {
  tboxes.forEach((box, i) => {
    const scaleVal = Math.max(0.6, 1 - (tboxes.length - i) * 0.05);
    const opacityVal = Math.max(0.3, 1 - (tboxes.length - i) * 0.1);

    gsap.to(box, {
      scale: scaleVal,
      opacity: opacityVal,
      scrollTrigger: {
        trigger: box,
        start: "top top+=100px",
        end: "bottom top",
        scrub: true,
      }
    });
  });
}

  // Title sticky demo 3
  const triggerEl = document.querySelector(".bl-testimonials-3");
const pinEl = document.querySelector(".sticky-box-4");

if (triggerEl && pinEl) {
  ScrollTrigger.create({
    trigger: triggerEl,
    start: "top 0",
    end: "bottom 250px",
    pin: pinEl,
    pinSpacing: true,
    markers: false
  });
}

  // Education ScrollTrigger
  const educationtriggerEl = document.querySelector(".bl-education");
const stickypinEl = document.querySelector(".sticky-box");

if (educationtriggerEl && stickypinEl) {
  ScrollTrigger.create({
    trigger: educationtriggerEl,
    start: "top 30px",
    end: "bottom 150px",
    pin: stickypinEl,
    pinSpacing: true,
    markers: false
  });
}

  // Experience ScrollTrigger
  const experiencetriggerEl = document.querySelector(".bl-experience");
const experiencepinEl = document.querySelector(".sticky-box-2");

if (experiencetriggerEl && experiencepinEl) {
  ScrollTrigger.create({
    trigger: experiencetriggerEl,
    start: "top 30px",
    end: "bottom 150px",
    pin: experiencepinEl,
    pinSpacing: true,
    markers: false
  });
}

  // Store service section triggers
  const serviceTriggers = [];

  // Service section animation
  gsap.utils.toArray(".bl-service").forEach((card, i) => {
    const trigger = gsap.to(card, {
      y: i % 2 === 0 ? -50 : 50, // alternate up/down
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    }).scrollTrigger;

    serviceTriggers.push(trigger);
  });

  // --- Numbers Section Animation ---
  const triggerSection = document.querySelector('.bl-achieve');
  const elements = document.querySelectorAll('.bl-num');

  // Store ScrollTriggers created by this animation
  const numberTriggers = [];

  elements.forEach(el => {
    const tween = gsap.from(el, {
      textContent: 0,
      duration: 2,
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: triggerSection,
        start: 'top bottom',
        toggleActions: 'play none none none',
        once: true,
        markers: false
      }
    });

    numberTriggers.push(tween.scrollTrigger);

  });

  // --- Project 1 Image Animation ---
  const projectTriggers = [];

const cards = gsap.utils.toArray(".bl-project .item");

if (cards.length > 0) {
  cards.forEach((card) => {
    const tween = gsap.to(card, {
      scale: 1.1,
      opacity: 0.8,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "top top",
        scrub: true
      }
    });

    if (tween.scrollTrigger) {
      projectTriggers.push(tween.scrollTrigger);
    }
  });
}

  /*  Hire section  */
 const hireEl = document.querySelector(".bl-hire");

if (hireEl) {
  gsap.to(hireEl, {
    backgroundSize: "120%",
    backgroundPositionX: "50%",
    ease: "none", // or "power1.out"
    scrollTrigger: {
      trigger: hireEl,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
}

  // Cleanup function when screen < 992px
  return () => {
    serviceTriggers.forEach(trigger => trigger.kill());
    numberTriggers.forEach(trigger => trigger.kill());
    projectTriggers.forEach(trigger => trigger.kill());
  };
});





