// js/gdd.js
(() => {
  const GDD = window.GDD;
  if (!GDD) return;

  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // theme
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

  // hero
  document.getElementById("gddKicker").textContent = GDD.kicker || "";
  document.getElementById("gddTitle").textContent = GDD.title || "";
  document.getElementById("gddSubtitle").textContent = GDD.subtitle || "";

  const heroImg = document.getElementById("gddHeroImg");
  heroImg.src = GDD.heroImage || "";
  heroImg.alt = (GDD.title || "Game") + " Hero";

  const meta = document.getElementById("gddMeta");
  meta.innerHTML = (GDD.meta || []).map(m => `<span class="gdd-chip">${m}</span>`).join("");

  const primary = document.getElementById("gddPrimary");
  const secondary = document.getElementById("gddSecondary");
  if (GDD.links?.primary?.url) {
    primary.textContent = GDD.links.primary.label || "Link";
    primary.href = GDD.links.primary.url;
  } else {
    primary.style.display = "none";
  }
  if (GDD.links?.secondary?.url) {
    secondary.textContent = GDD.links.secondary.label || "Link";
    secondary.href = GDD.links.secondary.url;
  } else {
    secondary.style.display = "none";
  }

  // sections render
  const wrap = document.getElementById("gddSections");
  const toc = document.getElementById("tocNav");
  wrap.innerHTML = "";
  toc.innerHTML = "";

  function sectionEl(s) {
    const sec = document.createElement("section");
    sec.className = "gdd-section";
    sec.id = s.id;

    const h2 = document.createElement("h2");
    h2.textContent = s.title || "";
    sec.appendChild(h2);

    if (s.type === "text") {
      (s.body || []).forEach(t => {
        const p = document.createElement("p");
        p.textContent = t;
        sec.appendChild(p);
      });
    }

    if (s.type === "list") {
      if (s.intro) {
        const p = document.createElement("p");
        p.textContent = s.intro;
        sec.appendChild(p);
      }
      const ul = document.createElement("ul");
      ul.className = "gdd-list";
      (s.items || []).forEach(it => {
        const li = document.createElement("li");
        li.textContent = it;
        ul.appendChild(li);
      });
      sec.appendChild(ul);
    }

    if (s.type === "cards") {
      const grid = document.createElement("div");
      grid.className = "gdd-cols";
      (s.cards || []).forEach(card => {
        const c = document.createElement("div");
        c.className = "gdd-card";
        const h3 = document.createElement("h3");
        h3.textContent = card.title || "";
        c.appendChild(h3);

        const ul = document.createElement("ul");
        ul.className = "gdd-list";
        (card.points || []).forEach(pt => {
          const li = document.createElement("li");
          li.textContent = pt;
          ul.appendChild(li);
        });
        c.appendChild(ul);
        grid.appendChild(c);
      });
      sec.appendChild(grid);
    }

    if (s.figure?.src) {
      const fig = document.createElement("figure");
      fig.className = "gdd-figure";
      const img = document.createElement("img");
      img.src = s.figure.src;
      img.alt = s.figure.caption || "Figure";
      fig.appendChild(img);
      if (s.figure.caption) {
        const cap = document.createElement("figcaption");
        cap.textContent = s.figure.caption;
        fig.appendChild(cap);
      }
      sec.appendChild(fig);
    }

    return sec;
  }

  (GDD.sections || []).forEach(s => {
    wrap.appendChild(sectionEl(s));

    const a = document.createElement("a");
    a.href = "#" + s.id;
    a.textContent = s.title;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(s.id).scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#" + s.id);
    });
    toc.appendChild(a);
  });

  // active toc highlight
  const links = Array.from(toc.querySelectorAll("a"));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.classList.remove("active"));
      const active = toc.querySelector(`a[href="#${en.target.id}"]`);
      if (active) active.classList.add("active");
    });
  }, { rootMargin: "-30% 0px -60% 0px", threshold: 0.01 });

  (GDD.sections || []).forEach(s => {
    const el = document.getElementById(s.id);
    if (el) obs.observe(el);
  });

  // toc toggle (mobile)
  const tocToggle = document.getElementById("tocToggle");
  if (tocToggle) {
    tocToggle.addEventListener("click", () => {
      const isHidden = toc.style.display === "none";
      toc.style.display = isHidden ? "flex" : "none";
    });
  }
})();