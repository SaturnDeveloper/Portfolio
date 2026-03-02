// js/gallery.js
(() => {
  const ALL_PROJECTS = window.PROJECTS || [];

  // OPTIONAL: wenn du Film & Games NICHT in dieser Galerie willst:
  const EXCLUDED_MEDIA = new Set(["Film", "Games", "Writing"]);
  const PROJECTS = ALL_PROJECTS.filter(p => !EXCLUDED_MEDIA.has(p.medium));

  // ---- footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- theme
  const themeBtn = document.getElementById("themeBtn");
  function setTheme(next) {
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    if (themeBtn) themeBtn.textContent = next === "dark" ? "☀️" : "🌙";
  }
  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "light" : "dark");
  });

  // ---- refs
  const grid = document.getElementById("galleryGrid");
  const mediumFilters = document.getElementById("mediumFilters");
  const searchEl = document.getElementById("search");

  const tagInput = document.getElementById("tagInput");
  const tagSuggest = document.getElementById("tagSuggest");
  const selectedTagsEl = document.getElementById("selectedTags");
  const clearTagsBtn = document.getElementById("clearTags");

  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightboxContent");

  const uniq = (arr) => [...new Set(arr)];

  // ---- flatten: jedes Bild = eigenes Gallery-Item
  function projectImages(p) {
    if (p.media?.type === "gallery" && Array.isArray(p.media.images) && p.media.images.length) {
      return p.media.images;
    }
    if (p.media?.type === "image" && p.media.src) {
      return [p.media.src];
    }
    return [];
  }

  const ITEMS = PROJECTS.flatMap(p => {
    const imgs = projectImages(p);
    return imgs.map((src, idx) => ({
      key: `${p.id}__${idx}`,
      imgSrc: src,
      imgIndex: idx,
      project: p
    }));
  });

  // ---- tags universe + counts (pro Projekt-Tag, nicht pro Bild)
  const tagCounts = new Map();
  for (const p of PROJECTS) {
    for (const t of (p.tags || [])) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  }
  const allTags = Array.from(tagCounts.keys()).sort((a, b) => a.localeCompare(b));

  // ---- mediums
  const mediums = ["All", ...uniq(PROJECTS.map(p => p.medium).filter(Boolean)).sort((a,b)=>a.localeCompare(b))];

  // ---- state
  const state = {
    medium: "All",
    q: "",
    tags: []
  };

  // ---- URL params: ?medium=3D&tags=rust,tiling&q=...
  {
    const params = new URLSearchParams(location.search);
    const m = params.get("medium");
    const q = params.get("q");
    const tags = params.get("tags");

    if (m) state.medium = decodeURIComponent(m);
    if (q) state.q = decodeURIComponent(q);

    if (state.medium !== "All" && !mediums.includes(state.medium)) state.medium = "All";

    if (tags) {
      const list = decodeURIComponent(tags)
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      state.tags = list.filter(t => tagCounts.has(t));
    }

    if (searchEl && state.q) searchEl.value = state.q;
  }

  // ---- filter helpers
  function hasAllTagsProject(p) {
    if (state.tags.length === 0) return true;
    const set = new Set(p.tags || []);
    return state.tags.every(t => set.has(t));
  }

  function matchesItem(it) {
    const p = it.project;

    if (state.medium !== "All" && p.medium !== state.medium) return false;
    if (!hasAllTagsProject(p)) return false;

    const q = state.q.trim().toLowerCase();
    if (!q) return true;

    const hay = [
      p.title, p.short, p.year, p.role, p.medium,
      ...(p.tags || []),
      ...(p.stack || [])
    ].join(" ").toLowerCase();

    return hay.includes(q);
  }

  // ---- medium filters
  function renderMediumFilters() {
    if (!mediumFilters) return;
    mediumFilters.innerHTML = "";

    mediums.forEach(m => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (state.medium === m ? " active" : "");
      btn.textContent = m;
      btn.addEventListener("click", () => {
        state.medium = m;
        renderMediumFilters();
        renderGrid();
      });
      mediumFilters.appendChild(btn);
    });
  }

  // ---- selected tag chips
  function renderSelectedTags() {
    if (!selectedTagsEl) return;
    selectedTagsEl.innerHTML = "";

    if (state.tags.length === 0) {
      const empty = document.createElement("span");
      empty.className = "muted";
      empty.style.fontSize = "13px";
      empty.textContent = "Keine Tags ausgewählt.";
      selectedTagsEl.appendChild(empty);
      return;
    }

    for (const t of state.tags) {
      const chip = document.createElement("span");
      chip.className = "tag-chip";
      chip.innerHTML = `<span>${t}</span><button type="button" aria-label="Tag entfernen">✕</button>`;
      chip.querySelector("button").addEventListener("click", () => {
        state.tags = state.tags.filter(x => x !== t);
        renderSelectedTags();
        renderGrid();
      });
      selectedTagsEl.appendChild(chip);
    }
  }

  // ---- suggest
  function openSuggest() {
    if (!tagSuggest) return;
    tagSuggest.style.display = "block";
  }
  function closeSuggest() {
    if (!tagSuggest) return;
    tagSuggest.style.display = "none";
    tagSuggest.innerHTML = "";
  }

  function addTag(tag) {
    if (!tag || state.tags.includes(tag)) return;
    state.tags.push(tag);
    state.tags.sort((a,b)=>a.localeCompare(b));
    if (tagInput) tagInput.value = "";
    closeSuggest();
    renderSelectedTags();
    renderGrid();
    if (tagInput) tagInput.focus();
  }

  function renderSuggest() {
    if (!tagSuggest || !tagInput) return;

    const q = tagInput.value.trim().toLowerCase();
    let list = allTags;

    if (q) list = list.filter(t => t.toLowerCase().includes(q));

    const selected = new Set(state.tags);
    list = list.filter(t => !selected.has(t));

    list.sort((a, b) => {
      const ca = tagCounts.get(a) || 0;
      const cb = tagCounts.get(b) || 0;
      if (cb !== ca) return cb - ca;
      return a.localeCompare(b);
    });

    const top = list.slice(0, 10);
    tagSuggest.innerHTML = "";

    if (top.length === 0) {
      const div = document.createElement("div");
      div.className = "suggest-item";
      div.style.cursor = "default";
      div.innerHTML = `<span class="muted">Keine Tags gefunden.</span>`;
      tagSuggest.appendChild(div);
      openSuggest();
      return;
    }

    for (const t of top) {
      const div = document.createElement("div");
      div.className = "suggest-item";
      div.innerHTML = `<span>${t}</span><span class="suggest-count">${tagCounts.get(t) || 0}</span>`;
      div.addEventListener("mousedown", (e) => {
        e.preventDefault();
        addTag(t);
      });
      tagSuggest.appendChild(div);
    }

    openSuggest();
  }

  // ---- Lightbox (mehrere Bilder pro Projekt, Startindex = geklicktes Bild)
  function openLightbox(item) {
    if (!lightbox || !lightboxContent) return;

    const p = item.project;
    const imgs = projectImages(p);
    let current = Math.max(0, Math.min(item.imgIndex, imgs.length - 1));

    const tags = (p.tags || []).map(t => `<span class="pill">${t}</span>`).join("");
    const stack = (p.stack || []).map(s => `<span class="pill">${s}</span>`).join("");
    const meta = [p.medium, p.year, p.role].filter(Boolean).join(" · ");

    const links = (p.links || []).map(l =>
      `<a class="btn ghost" href="${l.url}" target="_blank" rel="noreferrer">${l.label}</a>`
    ).join("");

    const insightsBtn = p.insights ? `<a class="btn" href="${p.insights}">Insights</a>` : "";

    lightboxContent.innerHTML = `
      <div class="lightbox-wrap">
        <div class="lightbox-media">
          <div class="lb-top">
            <button class="mini-btn" type="button" id="lbPrev">‹</button>
            <div class="lb-counter" id="lbCounter"></div>
            <button class="mini-btn" type="button" id="lbNext">›</button>
          </div>

          <img id="lbMain" alt="${p.title}">
          <div class="lb-thumbs" id="lbThumbs"></div>
        </div>

        <div class="lightbox-side">
          <h3>${p.title}</h3>
          <p class="muted">${meta}</p>
          <p class="muted">${p.short || ""}</p>
          <div class="pills">${tags}</div>
          <div class="pills" style="margin-top:10px">${stack}</div>
          <div class="row" style="margin-top:14px">
            ${insightsBtn}
            ${links}
          </div>
        </div>
      </div>
    `;

    const main = document.getElementById("lbMain");
    const thumbs = document.getElementById("lbThumbs");
    const counter = document.getElementById("lbCounter");
    const prevBtn = document.getElementById("lbPrev");
    const nextBtn = document.getElementById("lbNext");

    function render() {
      main.src = imgs[current];
      counter.textContent = `${current + 1} / ${imgs.length}`;

      thumbs.innerHTML = imgs.map((src, i) => `
        <button class="lb-thumb ${i === current ? "active" : ""}" type="button" data-i="${i}">
          <img src="${src}" alt="thumb ${i+1}">
        </button>
      `).join("");

      thumbs.querySelectorAll(".lb-thumb").forEach(b => {
        b.addEventListener("click", () => {
          current = Number(b.dataset.i);
          render();
        });
      });
    }

    function prev() {
      current = (current - 1 + imgs.length) % imgs.length;
      render();
    }
    function next() {
      current = (current + 1) % imgs.length;
      render();
    }

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    // Keyboard while dialog open
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey, { passive: true });

    lightbox.addEventListener("close", () => {
      document.removeEventListener("keydown", onKey);
    }, { once: true });

    render();
    lightbox.showModal();
  }

  // ---- grid item (jedes Bild einzeln)
  function tile(it) {
    const p = it.project;

    const el = document.createElement("article");
    el.className = "gitem";
    el.tabIndex = 0;

    el.innerHTML = `
      <img class="gitem__thumb" src="${it.imgSrc}" alt="${p.title}" loading="lazy" />
      <div class="gitem__body">
        <div class="gitem__top">
          <h3 class="gitem__title">${p.title}</h3>
          <span class="gitem__meta">${p.medium || ""}</span>
        </div>
        <p class="gitem__desc">${p.short || ""}</p>
      </div>
    `;

    el.addEventListener("click", () => openLightbox(it));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openLightbox(it);
    });

    return el;
  }

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = "";

    const list = ITEMS.filter(matchesItem);

    if (list.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Keine Treffer. Tags/Filter/Suche anpassen.";
      grid.appendChild(empty);
      return;
    }

    list.forEach(it => grid.appendChild(tile(it)));
  }

  // ---- events
  if (searchEl) {
    searchEl.addEventListener("input", () => {
      state.q = searchEl.value;
      renderGrid();
    });
  }

  if (tagInput) {
    tagInput.addEventListener("input", renderSuggest);
    tagInput.addEventListener("focus", renderSuggest);

    tagInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const typed = tagInput.value.trim();
        if (typed && tagCounts.has(typed) && !state.tags.includes(typed)) {
          addTag(typed);
          return;
        }
        const first = tagSuggest?.querySelector(".suggest-item span");
        if (first) addTag(first.textContent.trim());
      }

      if (e.key === "Escape") {
        closeSuggest();
        tagInput.blur();
      }
    });

    document.addEventListener("click", (ev) => {
      const t = ev.target;
      const inside = (tagSuggest && tagSuggest.contains(t)) || (tagInput && tagInput.contains(t));
      if (!inside) closeSuggest();
    });
  }

  if (clearTagsBtn) {
    clearTagsBtn.addEventListener("click", () => {
      state.tags = [];
      renderSelectedTags();
      renderGrid();
    });
  }

  // ---- initial
  renderMediumFilters();
  renderSelectedTags();
  renderGrid();
})();