const pages = [...document.querySelectorAll("[data-page]")];
const links = [...document.querySelectorAll("[data-page-link]")];
const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".nav-toggle");

function showPage(hash, push = true) {
  const target = document.querySelector(hash);
  if (!target) return;
  pages.forEach((page) => page.classList.toggle("active", page === target));
  links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === hash));
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "auto" });
  if (push) history.pushState({ hash }, "", hash);
}

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash?.startsWith("#")) return;
    event.preventDefault();
    showPage(hash);
  });
});

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
    } catch {
      return;
    }
    const old = button.textContent;
    button.textContent = "已复制";
    setTimeout(() => (button.textContent = old), 1200);
  });
});

const imageModal = document.querySelector("[data-image-modal]");
const modalImage = imageModal?.querySelector("img");
const closeModal = imageModal?.querySelector("[data-close-modal]");
const projectModal = document.querySelector("[data-project-modal]");
const closeProjectModal = document.querySelector("[data-close-project]");

function setModal(open) {
  imageModal?.classList.toggle("open", open);
  imageModal?.setAttribute("aria-hidden", String(!open));
  if (!open && modalImage) modalImage.src = "";
}

function setProjectModal(open) {
  projectModal?.classList.toggle("open", open);
  projectModal?.setAttribute("aria-hidden", String(!open));
}

document.querySelectorAll("[data-project-gallery]").forEach((gallery) => {
  const image = gallery.querySelector("[data-project-gallery-image]");
  const count = gallery.querySelector("[data-project-gallery-count]");
  const slides = [
    { src: "assets/img/corpus-collector-1.png", alt: "Corpus Collector 语料挖掘助手界面 1" },
    { src: "assets/img/corpus-collector-2.png", alt: "Corpus Collector 语料挖掘助手界面 2" },
    { src: "assets/img/corpus-collector-3.png", alt: "Corpus Collector 语料挖掘助手界面 3" },
  ];
  let index = 0;

  function render(nextIndex) {
    if (!image) return;
    index = (nextIndex + slides.length) % slides.length;
    const slide = slides[index];
    image.style.opacity = "0";
    window.setTimeout(() => {
      image.src = slide.src;
      image.alt = slide.alt;
      gallery.dataset.zoomImage = slide.src;
      if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      image.style.opacity = "1";
    }, 120);
  }

  gallery.querySelector("[data-project-gallery-prev]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    render(index - 1);
  });
  gallery.querySelector("[data-project-gallery-next]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    render(index + 1);
  });
  gallery.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    render(index + (event.key === "ArrowRight" ? 1 : -1));
  });
  render(0);
});

document.querySelectorAll("[data-zoom-image]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.matches("[data-portrait-slide]:not(.is-active)")) return;
    if (button.dataset.dragMoved === "true") {
      button.dataset.dragMoved = "false";
      return;
    }
    if (!modalImage) return;
    modalImage.src = button.dataset.zoomImage;
    setModal(true);
  });
  button.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (button.matches("[data-portrait-slide]:not(.is-active)")) return;
    event.preventDefault();
    if (!modalImage) return;
    modalImage.src = button.dataset.zoomImage;
    setModal(true);
  });
});

closeModal?.addEventListener("click", () => setModal(false));
imageModal?.addEventListener("click", (event) => {
  if (event.target === imageModal) setModal(false);
});
document.querySelectorAll("[data-project-detail]").forEach((button) => {
  button.addEventListener("click", () => setProjectModal(true));
});
closeProjectModal?.addEventListener("click", () => setProjectModal(false));
projectModal?.addEventListener("click", (event) => {
  if (event.target === projectModal) setProjectModal(false);
});

const projectFlipCards = [...document.querySelectorAll("[data-project-flip-card]")];

function setProjectFlip(card, flipped) {
  if (!card) return;
  card.classList.toggle("is-flipped", flipped);
  card.querySelector(".project-summary-front")?.setAttribute("aria-hidden", String(flipped));
  card.querySelector(".project-summary-back")?.setAttribute("aria-hidden", String(!flipped));
  if (flipped) card.querySelector(".project-summary-back")?.scrollTo({ top: 0 });
}

document.querySelectorAll("[data-project-flip]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    projectFlipCards.forEach((card) => setProjectFlip(card, card === button.closest("[data-project-flip-card]")));
  });
});

projectFlipCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a, [data-project-back]")) return;
    event.stopPropagation();
    const shouldFlip = !card.classList.contains("is-flipped");
    projectFlipCards.forEach((item) => setProjectFlip(item, item === card && shouldFlip));
  });
});

document.querySelectorAll("[data-project-back]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    setProjectFlip(button.closest("[data-project-flip-card]"), false);
  });
});

document.addEventListener("click", (event) => {
  const flippedProject = projectFlipCards.find((card) => card.classList.contains("is-flipped"));
  if (flippedProject && !event.target.closest("[data-project-flip-card]")) {
    setProjectFlip(flippedProject, false);
  }
});

document.querySelectorAll("[data-merit-button]").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pop = document.createElement("span");
    pop.className = "merit-pop";
    pop.innerHTML = '<i aria-hidden="true">✦</i><b>+1</b>';
    pop.style.left = `${Math.min(window.innerWidth - 112, rect.right - 26 + Math.random() * 14)}px`;
    pop.style.top = `${rect.top + 20 + Math.random() * 42}px`;
    document.body.append(pop);
    pop.addEventListener("animationend", () => pop.remove());
  });
});

const portraitCarousel = document.querySelector("[data-portrait-carousel]");
if (portraitCarousel) {
  const slides = [...portraitCarousel.querySelectorAll("[data-portrait-slide]")];
  const nextButton = portraitCarousel.querySelector("[data-portrait-next]");
  let currentSlide = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

  function setPortraitSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const offset = (slideIndex - currentSlide + slides.length) % slides.length;
      slide.classList.toggle("is-active", offset === 0);
      slide.classList.toggle("is-next", offset === 1);
      slide.classList.toggle("is-tail", offset === 2);
      slide.tabIndex = offset < 3 ? 0 : -1;
      slide.setAttribute("aria-hidden", String(offset > 2));
    });
  }

  slides.forEach((slide, index) => {
    slide.addEventListener("click", (event) => {
      if (index === currentSlide) return;
      event.preventDefault();
      event.stopPropagation();
      setPortraitSlide(index);
    });
  });

  nextButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPortraitSlide(currentSlide + 1);
  });

  setPortraitSlide(currentSlide);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeNode(source, target, delay) {
  if (source.nodeType === Node.TEXT_NODE) {
    const text = document.createTextNode("");
    target.append(text);
    for (const char of Array.from(source.textContent || "")) {
      text.textContent += char;
      await sleep(delay);
    }
    return;
  }
  if (source.nodeType !== Node.ELEMENT_NODE) return;
  const clone = source.cloneNode(false);
  target.append(clone);
  for (const child of [...source.childNodes]) {
    await typeNode(child, clone, delay);
  }
}

const typewriter = document.querySelector("[data-typewriter]");
if (typewriter && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lines = [...typewriter.querySelectorAll("[data-type-line]")];
  const originals = lines.map((line) => [...line.childNodes].map((node) => node.cloneNode(true)));
  lines.forEach((line) => (line.textContent = ""));
  typewriter.classList.add("is-typing");

  (async () => {
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      line.classList.add("is-current");
      for (const node of originals[index]) {
        await typeNode(node, line, 34);
      }
      line.classList.remove("is-current");
      await sleep(180);
    }
    typewriter.classList.remove("is-typing");
  })();
}

const internCards = [...document.querySelectorAll("[data-intern-card]")];

function setInternCard(card, flipped, restoreFocus = false) {
  if (!card) return;
  const front = card.querySelector(".intern-front");
  const back = card.querySelector(".intern-back");
  const frontButton = card.querySelector("[data-intern-flip]");
  const backButton = card.querySelector("[data-intern-back]");

  card.classList.toggle("is-flipped", flipped);
  front?.setAttribute("aria-hidden", String(flipped));
  back?.setAttribute("aria-hidden", String(!flipped));
  if (frontButton) frontButton.disabled = flipped;
  if (backButton) backButton.tabIndex = flipped ? 0 : -1;

  if (flipped) {
    card.querySelector(".intern-back-copy")?.scrollTo({ top: 0 });
    window.setTimeout(() => backButton?.focus({ preventScroll: true }), 390);
  } else if (restoreFocus) {
    window.setTimeout(() => frontButton?.focus({ preventScroll: true }), 390);
  }
}

document.querySelectorAll("[data-intern-flip]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    internCards.forEach((card) => setInternCard(card, card.dataset.internCard === trigger.dataset.internFlip));
  });
});

document.querySelectorAll("[data-intern-back]").forEach((button) => {
  button.tabIndex = -1;
  button.addEventListener("click", () => setInternCard(button.closest("[data-intern-card]"), false, true));
});

document.addEventListener("click", (event) => {
  const flippedIntern = internCards.find((card) => card.classList.contains("is-flipped"));
  if (flippedIntern && !event.target.closest("[data-intern-card]")) {
    setInternCard(flippedIntern, false);
  }
});

internCards.forEach((card) => {
  card.querySelector(".intern-back")?.addEventListener("click", () => setInternCard(card, false));
});

const schoolCards = [...document.querySelectorAll("[data-school-card]")];

function setSchoolCard(card, flipped, restoreFocus = false) {
  if (!card) return;
  const front = card.querySelector(".school-front");
  const back = card.querySelector(".school-back");
  const frontButton = card.querySelector("[data-school-flip]");
  const backButton = card.querySelector("[data-school-return]");

  card.classList.toggle("is-flipped", flipped);
  front?.setAttribute("aria-hidden", String(flipped));
  back?.setAttribute("aria-hidden", String(!flipped));
  if (frontButton) frontButton.disabled = flipped;
  if (backButton) backButton.tabIndex = flipped ? 0 : -1;

  if (flipped) {
    window.setTimeout(() => backButton?.focus({ preventScroll: true }), 390);
  } else if (restoreFocus) {
    window.setTimeout(() => frontButton?.focus({ preventScroll: true }), 390);
  }
}

document.querySelectorAll("[data-school-flip]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    schoolCards.forEach((card) => setSchoolCard(card, card.dataset.schoolCard === button.dataset.schoolFlip));
  });
});

document.querySelectorAll("[data-school-return]").forEach((button) => {
  button.tabIndex = -1;
  button.addEventListener("click", () => setSchoolCard(button.closest("[data-school-card]"), false, true));
});

document.addEventListener("click", (event) => {
  const flippedSchool = schoolCards.find((card) => card.classList.contains("is-flipped"));
  if (flippedSchool && !event.target.closest("[data-school-card]")) {
    setSchoolCard(flippedSchool, false);
  }
});

schoolCards.forEach((card) => {
  card.querySelector(".school-back")?.addEventListener("click", () => setSchoolCard(card, false));
});

const archiveCards = [...document.querySelectorAll("[data-archive-card]")];
const archiveCardIds = archiveCards.map((card) => card.dataset.archiveCard);
const drawButton = document.querySelector("[data-draw-card]");
const deckPanel = document.querySelector(".deck-panel");
const drawnPosition = document.querySelector("[data-drawn-position]");
let currentArchiveCard = archiveCards.find((card) => card.classList.contains("is-active"))?.dataset.archiveCard || archiveCardIds[0];
let drawBag = [];

function shuffle(values) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function refillDrawBag() {
  drawBag = shuffle(archiveCardIds);
  if (drawBag[0] === currentArchiveCard && drawBag.length > 1) {
    [drawBag[0], drawBag[1]] = [drawBag[1], drawBag[0]];
  }
}

function setCarouselIndex(carousel, index, behavior = "smooth") {
  if (!carousel) return;
  const track = carousel.querySelector("[data-carousel-track]");
  const slides = [...(track?.children || [])];
  const range = carousel.querySelector("[data-carousel-range]");
  const count = carousel.querySelector("[data-carousel-count]");
  const bounded = Math.max(0, Math.min(index, slides.length - 1));
  if (track && slides[bounded]) {
    track.scrollTo({ left: slides[bounded].offsetLeft - track.offsetLeft, behavior });
  }
  if (range) range.value = String(bounded);
  if (count) count.value = `${String(bounded + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
}

function resetArchiveCard(card) {
  if (!card) return;
  card.classList.remove("is-flipped", "is-entering");
  card.querySelector(".card-front")?.setAttribute("aria-hidden", "false");
  card.querySelector(".card-back")?.setAttribute("aria-hidden", "true");
  const flipButton = card.querySelector("[data-card-flip]");
  const returnButton = card.querySelector("[data-card-return]");
  if (flipButton) flipButton.disabled = false;
  if (returnButton) returnButton.tabIndex = -1;
  card.querySelector(".card-back-scroll")?.scrollTo({ top: 0 });
  card.querySelectorAll("[data-carousel]").forEach((carousel) => setCarouselIndex(carousel, 0, "auto"));
}

function setArchiveCard(id, { animate = true, scrollToStage = false } = {}) {
  const target = archiveCards.find((card) => card.dataset.archiveCard === id);
  if (!target) return;

  archiveCards.forEach((card) => {
    resetArchiveCard(card);
    card.hidden = card !== target;
    card.classList.toggle("is-active", card === target);
  });

  currentArchiveCard = id;
  const position = archiveCardIds.indexOf(id) + 1;
  if (drawnPosition) drawnPosition.textContent = String(position).padStart(2, "0");
  if (animate) {
    void target.offsetWidth;
    target.classList.add("is-entering");
    window.setTimeout(() => target.classList.remove("is-entering"), 440);
  }
  if (scrollToStage) {
    document.querySelector("[data-card-stage]")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

drawButton?.addEventListener("click", () => {
  if (!drawBag.length) refillDrawBag();
  let nextCard = drawBag.shift();
  if (nextCard === currentArchiveCard) {
    if (!drawBag.length) refillDrawBag();
    const replacement = drawBag.shift();
    if (replacement) {
      drawBag.push(nextCard);
      nextCard = replacement;
    }
  }

  drawButton.disabled = true;
  deckPanel?.classList.add("is-drawing");
  window.setTimeout(() => setArchiveCard(nextCard), 150);
  window.setTimeout(() => {
    drawButton.disabled = false;
    deckPanel?.classList.remove("is-drawing");
  }, 470);
});

document.querySelectorAll("[data-card-flip]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-archive-card]");
    if (!card) return;
    card.classList.add("is-flipped");
    card.querySelector(".card-front")?.setAttribute("aria-hidden", "true");
    card.querySelector(".card-back")?.setAttribute("aria-hidden", "false");
    button.disabled = true;
    const returnButton = card.querySelector("[data-card-return]");
    if (returnButton) returnButton.tabIndex = 0;
    window.setTimeout(() => returnButton?.focus({ preventScroll: true }), 390);
  });
});

document.querySelectorAll("[data-card-return]").forEach((button) => {
  button.tabIndex = -1;
  button.addEventListener("click", () => {
    const card = button.closest("[data-archive-card]");
    if (!card) return;
    resetArchiveCard(card);
    window.setTimeout(() => card.querySelector("[data-card-flip]")?.focus({ preventScroll: true }), 390);
  });
});

document.querySelectorAll("[data-index-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".archive-index-item");
    const detail = item?.querySelector(".archive-index-detail");
    const willOpen = button.getAttribute("aria-expanded") !== "true";

    document.querySelectorAll("[data-index-toggle]").forEach((otherButton) => {
      const otherDetail = otherButton.closest(".archive-index-item")?.querySelector(".archive-index-detail");
      otherButton.setAttribute("aria-expanded", "false");
      if (otherDetail) otherDetail.hidden = true;
    });

    button.setAttribute("aria-expanded", String(willOpen));
    if (detail) detail.hidden = !willOpen;
  });
});

document.querySelector("[data-scroll-index]")?.addEventListener("click", () => {
  document.querySelector("[data-card-index]")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

const bookTabs = [...document.querySelectorAll("[data-book-tab]")];
const bookPages = [...document.querySelectorAll("[data-book-page]")];
const archiveBook = document.querySelector(".archive-book");
const closedBook = document.querySelector("[data-open-book]");

function showBookPage(id) {
  const index = Math.max(0, bookTabs.findIndex((tab) => tab.dataset.bookTab === id));
  archiveBook?.classList.remove("is-turning");
  void archiveBook?.offsetWidth;
  archiveBook?.classList.add("is-turning");
  archiveBook?.classList.remove("is-closed");
  archiveBook?.classList.remove("page-index-1", "page-index-2", "page-index-3", "page-index-4", "page-index-5", "page-index-6");
  archiveBook?.classList.add(`page-index-${index + 1}`);
  bookTabs.forEach((tab) => {
    const tabIndex = bookTabs.indexOf(tab);
    const active = tab.dataset.bookTab === id;
    tab.classList.toggle("active", active);
    tab.classList.toggle("before", tabIndex < index);
    tab.classList.toggle("after", tabIndex >= index);
    tab.setAttribute("aria-selected", String(active));
  });
  bookPages.forEach((page) => {
    const active = page.dataset.bookPage === id;
    page.classList.toggle("active", active);
    page.hidden = !active;
  });
  window.setTimeout(() => archiveBook?.classList.remove("is-turning"), 420);
}

bookTabs.forEach((tab) => {
  tab.addEventListener("click", () => showBookPage(tab.dataset.bookTab));
});
closedBook?.addEventListener("click", () => showBookPage(bookTabs[0]?.dataset.bookTab || "ai"));

let dragLayer = 20;

document.querySelectorAll("[data-drag-area]").forEach((area) => {
  area.querySelectorAll("img").forEach((image) => {
    image.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse") return;
      event.preventDefault();
      const areaRect = area.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      const startLeft = imageRect.left - areaRect.left;
      const startTop = imageRect.top - areaRect.top;
      const startX = event.clientX;
      const startY = event.clientY;
      let moved = false;

      image.style.left = `${startLeft}px`;
      image.style.top = `${startTop}px`;
      image.style.right = "auto";
      image.style.bottom = "auto";
      image.style.zIndex = String(++dragLayer);
      image.setPointerCapture(event.pointerId);

      const onMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
        const maxLeft = Math.max(0, area.clientWidth - image.offsetWidth);
        const maxTop = Math.max(0, area.clientHeight - image.offsetHeight);
        image.style.left = `${Math.max(0, Math.min(maxLeft, startLeft + dx))}px`;
        image.style.top = `${Math.max(0, Math.min(maxTop, startTop + dy))}px`;
      };

      const onUp = (upEvent) => {
        image.removeEventListener("pointermove", onMove);
        image.removeEventListener("pointerup", onUp);
        image.removeEventListener("pointercancel", onUp);
        if (image.hasPointerCapture(upEvent.pointerId)) image.releasePointerCapture(upEvent.pointerId);
        if (moved) {
          image.dataset.dragMoved = "true";
          window.setTimeout(() => {
            image.dataset.dragMoved = "false";
          }, 0);
        }
      };

      image.addEventListener("pointermove", onMove);
      image.addEventListener("pointerup", onUp);
      image.addEventListener("pointercancel", onUp);
    });
  });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const range = carousel.querySelector("[data-carousel-range]");
  const slides = [...(track?.children || [])];
  let scrollFrame;
  let dragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  const currentIndex = () => {
    if (!track || !slides.length) return 0;
    return slides.reduce((closest, slide, index) => {
      const distance = Math.abs((slide.offsetLeft - track.offsetLeft) - track.scrollLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity }).index;
  };

  track?.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const index = currentIndex();
      if (range) range.value = String(index);
      const count = carousel.querySelector("[data-carousel-count]");
      if (count) count.value = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    });
  });
  range?.addEventListener("input", () => setCarouselIndex(carousel, Number(range.value)));
  carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => setCarouselIndex(carousel, currentIndex() - 1));
  carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => setCarouselIndex(carousel, currentIndex() + 1));
  track?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setCarouselIndex(carousel, currentIndex() + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  track?.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") return;
    dragging = true;
    dragStartX = event.clientX;
    dragStartScroll = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });
  track?.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    track.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
  });
  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    setCarouselIndex(carousel, currentIndex());
  };
  track?.addEventListener("pointerup", endDrag);
  track?.addEventListener("pointercancel", endDrag);
});

setArchiveCard(currentArchiveCard, { animate: false });

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setModal(false);
    setProjectModal(false);
    projectFlipCards.forEach((card) => {
      if (card.classList.contains("is-flipped")) setProjectFlip(card, false);
    });
    internCards.forEach((card) => {
      if (card.classList.contains("is-flipped")) setInternCard(card, false, true);
    });
    schoolCards.forEach((card) => {
      if (card.classList.contains("is-flipped")) setSchoolCard(card, false, true);
    });
    archiveCards.forEach((card) => {
      if (card.classList.contains("is-flipped")) {
        resetArchiveCard(card);
        window.setTimeout(() => card.querySelector("[data-card-flip]")?.focus({ preventScroll: true }), 390);
      }
    });
  }
});

window.addEventListener("popstate", () => showPage(location.hash || "#about", false));
showPage(location.hash || "#about", false);
