// js/textures.js
(() => {
  const packs = window.TEXTURE_PACKS || [];

  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // theme (same behavior)
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

  const grid = document.getElementById("texturesGrid");
  const tagFilters = document.getElementById("tagFilters");
  const search = document.getElementById("search");

  const state = { tag: "All", q: "" };

  const uniq = (arr) => [...new Set(arr)];
  const allTags = uniq(packs.flatMap(p => p.tags || [])).sort((a,b)=>a.localeCompare(b));

  function matches(p) {
    const q = state.q.trim().toLowerCase();
    const tagOK = state.tag === "All" || (p.tags || []).includes(state.tag);

    if (!q) return tagOK;

    const hay = [
      p.title, p.resolution, p.license, p.note,
      ...(p.tags || []),
      ...(p.maps || [])
    ].join(" ").toLowerCase();

    return tagOK && hay.includes(q);
  }

  function renderTags() {
    if (!tagFilters) return;
    tagFilters.innerHTML = "";

    const makeBtn = (label) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (state.tag === label ? " active" : "");
      btn.textContent = label;
      btn.addEventListener("click", () => {
        state.tag = label;
        renderTags();
        renderGrid();
      });
      return btn;
    };

    tagFilters.appendChild(makeBtn("All"));
    allTags.forEach(t => tagFilters.appendChild(makeBtn(t)));
  }

  function card(p) {
    const el = document.createElement("article");
    el.className = "card";

    const tags = (p.tags || []).slice(0, 6).map(t => `<span class="pill">${t}</span>`).join("");
    const maps = (p.maps || []).join(" · ");

    el.innerHTML = `
      <div class="card__media">
        <img src="${p.preview || ""}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="card__body">
        <div class="card__top">
          <h3>${p.title}</h3>
          <span class="muted">${p.resolution || ""}</span>
        </div>
        <p class="muted" style="margin:6px 0 10px">${p.note || ""}</p>
        <div class="pills">${tags}</div>
        <p class="muted" style="margin:10px 0 0; font-size:13px">${maps}</p>
        <div class="row" style="margin-top:12px">
          <a class="btn" href="${p.download}" download>Download</a>
          <span class="pill">Lizenz: ${p.license || "—"}</span>
        </div>
      </div>
    `;
    return el;
  }

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = "";
    packs.filter(matches).forEach(p => grid.appendChild(card(p)));

    if (packs.filter(matches).length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Keine Treffer. Suchbegriff ändern oder Tag-Filter entfernen.";
      grid.appendChild(empty);
    }
  }

  if (search) {
    search.addEventListener("input", () => {
      state.q = search.value;
      renderGrid();
    });
  }

  renderTags();
  renderGrid();
})();