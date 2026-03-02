// js/app.js
(() => {
  document.documentElement.classList.add("js");

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  const themeBtn = document.getElementById("themeBtn");
  function setTheme(next) {
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    if (themeBtn) themeBtn.textContent = next === "dark" ? "☀️" : "🌙";
  }
  const savedTheme = localStorage.getItem("theme");
  setTheme(
    savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme;
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Data
  const PROJECTS = window.PROJECTS || [];

  // DOM
  const grid = document.getElementById("projectsGrid");
  const filtersEl = document.getElementById("filters");
  const modal = document.getElementById("projectModal");
  const modalContent = document.getElementById("modalContent");

  const state = { tag: "All" };
  const uniq = (arr) => [...new Set(arr)];

  // For keyboard nav in modal carousel
  let currentCarouselApi = null;

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getCoverSrc(p) {
    const m = p?.media;
    if (!m) return "";
    if (m.type === "image") return m.src || "";
    if (m.type === "gallery") return (m.images && m.images[0]) || "";
    return "";
  }

  // --- Carousel HTML builder (for modal only) ---
  function buildMediaHtml(p) {
    const m = p?.media;
    if (!m) return "";

    if (m.type === "image") {
      const src = m.src || "";
      if (!src) return "";
      return `<img class="modal__single" src="${src}" alt="${escapeHtml(p.title)}" />`;
    }

    if (m.type === "gallery") {
      const images = Array.isArray(m.images) ? m.images : [];
      if (!images.length) return "";

      // Slides
      const slides = images
        .map(
          (src, i) => `
          <div class="carousel__slide" data-i="${i}">
            <img src="${src}" alt="${escapeHtml(p.title)}" loading="lazy" />
          </div>`
        )
        .join("");

      // Dots
      const dots = images
        .map(
          (_, i) =>
            `<button class="carousel__dot" type="button" aria-label="Bild ${i + 1}" data-dot="${i}"></button>`
        )
        .join("");

      return `
        <div class="carousel" data-carousel>
          <div class="carousel__viewport" data-viewport>
            <div class="carousel__track" data-track>
              ${slides}
            </div>
          </div>

          <button class="carousel__nav prev" type="button" aria-label="Vorheriges Bild" data-prev>‹</button>
          <button class="carousel__nav next" type="button" aria-label="Nächstes Bild" data-next>›</button>

          <div class="carousel__dots" data-dots>
            ${dots}
          </div>
        </div>
      `;
    }

    return "";
  }

  // --- Wire up carousel interactions inside modalContent ---
  function setupCarousel(rootEl) {
    const carousel = rootEl.querySelector("[data-carousel]");
    if (!carousel) {
      currentCarouselApi = null;
      return;
    }

    const viewport = carousel.querySelector("[data-viewport]");
    const track = carousel.querySelector("[data-track]");
    const btnPrev = carousel.querySelector("[data-prev]");
    const btnNext = carousel.querySelector("[data-next]");
    const dotsWrap = carousel.querySelector("[data-dots]");
    const dots = Array.from(carousel.querySelectorAll("[data-dot]"));

    if (!viewport || !track) return;

    let index = 0;

    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    const slideCount = track.children.length;

    function update() {
      index = clamp(index, 0, slideCount - 1);
      track.style.transform = `translateX(${-index * 100}%)`;

      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
      if (btnPrev) btnPrev.disabled = index === 0;
      if (btnNext) btnNext.disabled = index === slideCount - 1;
    }

    function goTo(i) {
      index = i;
      update();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    // Buttons
    btnPrev?.addEventListener("click", prev);
    btnNext?.addEventListener("click", next);

    // Dots
    dotsWrap?.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const val = t.getAttribute("data-dot");
      if (val == null) return;
      goTo(Number(val));
    });

    // Swipe / drag
    let dragging = false;
    let startX = 0;
    let lastX = 0;

    const THRESHOLD = 40; // px

    function getClientX(ev) {
      // pointer events
      if ("clientX" in ev) return ev.clientX;
      return 0;
    }

    viewport.style.touchAction = "pan-y"; // allow vertical scroll, handle horizontal
    viewport.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = getClientX(e);
      lastX = startX;
      viewport.setPointerCapture?.(e.pointerId);
      carousel.classList.add("is-dragging");
    });

    viewport.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      lastX = getClientX(e);
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove("is-dragging");

      const dx = lastX - startX;
      if (Math.abs(dx) >= THRESHOLD) {
        if (dx < 0) next();
        else prev();
      }
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("lostpointercapture", endDrag);

    // Expose API for keyboard nav
    currentCarouselApi = { next, prev, goTo };

    // Init
    goTo(0);
  }

  function openModalById(id) {
    if (!modal || !modalContent) return;

    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;

    const links = (p.links || [])
      .map(
        (l) =>
          `<a class="btn ghost" href="${l.url}" target="_blank" rel="noreferrer">${l.label}</a>`
      )
      .join("");

    const insightsBtn = p.insights ? `<a class="btn" href="${p.insights}">Insights</a>` : "";

    const stack = (p.stack || []).map((s) => `<span class="pill">${s}</span>`).join("");
    const details = (p.details || []).map((d) => `<li>${d}</li>`).join("");

    const mediaHtml = buildMediaHtml(p);

    modalContent.innerHTML = `
      <div class="modal__grid">
        <div>
          <h3>${p.title}</h3>
          <p class="muted">${p.year} · ${p.role}</p>
          <div class="pills">${stack}</div>
          <p>${p.short}</p>
          <ul class="list">${details}</ul>

          <div class="row">
            ${links}
            ${insightsBtn}
          </div>
        </div>

        <div class="modal__media">
          ${mediaHtml || `<div class="muted">No media.</div>`}
        </div>
      </div>
    `;

    modal.showModal();
    setupCarousel(modalContent);
  }

  // Keyboard navigation when modal open
  function onKeyDown(e) {
    if (!modal?.open) return;
    if (!currentCarouselApi) return;

    if (e.key === "ArrowLeft") currentCarouselApi.prev();
    if (e.key === "ArrowRight") currentCarouselApi.next();
  }
  document.addEventListener("keydown", onKeyDown);

  // Expose for Babylon / external scripts
  window.openProjectById = (id) => openModalById(id);

  function renderFilters() {
    if (!filtersEl) return;

    const allTags = uniq(PROJECTS.flatMap((p) => p.tags || []));
    const filterTags = ["All", ...allTags];

    filtersEl.innerHTML = "";
    filterTags.forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (state.tag === tag ? " active" : "");
      btn.textContent = tag;
      btn.type = "button";
      btn.addEventListener("click", () => {
        state.tag = tag;
        renderFilters();
        renderGrid();
      });
      filtersEl.appendChild(btn);
    });
  }

  function projectCard(p) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    const tags = (p.tags || []).map((t) => `<span class="pill">${t}</span>`).join("");
    const cover = getCoverSrc(p);

    card.innerHTML = `
      <div class="card__media">
        ${
          cover
            ? `<img src="${cover}" alt="${escapeHtml(p.title)}" loading="lazy" />`
            : `<div class="muted" style="padding:12px;">No image</div>`
        }
      </div>
      <div class="card__body">
        <div class="card__top">
          <h3>${p.title}</h3>
          <span class="muted">${p.year}</span>
        </div>
        <p>${p.short}</p>
        <div class="pills">${tags}</div>
      </div>
    `;

    card.addEventListener("click", () => openModalById(p.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModalById(p.id);
    });

    return card;
  }

  function renderGrid() {
    if (!grid) return;

    grid.innerHTML = "";
    const list =
      state.tag === "All"
        ? PROJECTS
        : PROJECTS.filter((p) => (p.tags || []).includes(state.tag));

    list.forEach((p) => grid.appendChild(projectCard(p)));
  }

  // Reveal observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  renderFilters();
  renderGrid();
})();