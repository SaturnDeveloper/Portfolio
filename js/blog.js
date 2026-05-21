const grid = document.querySelector("#blogGrid");
const filters = document.querySelector("#blogFilters");
const search = document.querySelector("#blogSearch");
const count = document.querySelector("#blogCount");
const year = document.querySelector("#year");
const themeBtn = document.querySelector("#themeBtn");

let activeCategory = "Alle";

if (year) year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.documentElement.dataset.theme = "light";
updateThemeIcon();

themeBtn?.addEventListener("click", () => {
  const isLight = document.documentElement.dataset.theme === "light";
  document.documentElement.dataset.theme = isLight ? "" : "light";
  localStorage.setItem("theme", isLight ? "dark" : "light");
  updateThemeIcon();
});

function updateThemeIcon(){
  if (!themeBtn) return;
  themeBtn.textContent = document.documentElement.dataset.theme === "light" ? "☀️" : "🌙";
}

function getCategories(){
  return ["Alle", ...new Set(blogPosts.map(post => post.category))];
}

function renderFilters(){
  filters.innerHTML = getCategories().map(category => `
    <button class="chip ${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">
      ${category}
    </button>
  `).join("");

  filters.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderPosts();
    });
  });
}

function getFilteredPosts(){
  const term = search.value.trim().toLowerCase();

  return blogPosts
    .filter(post => activeCategory === "Alle" || post.category === activeCategory)
    .filter(post => {
      const text = `${post.title} ${post.category} ${post.excerpt}`.toLowerCase();
      return text.includes(term);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatDate(dateString){
  return new Intl.DateTimeFormat("de-AT", {
    day:"2-digit",
    month:"long",
    year:"numeric"
  }).format(new Date(dateString));
}

function renderPosts(){
  const posts = getFilteredPosts();
  count.textContent = `${posts.length} Beitrag${posts.length === 1 ? "" : "e"}`;

  if (!posts.length) {
    grid.innerHTML = `<p class="blog-empty">Keine Beiträge gefunden.</p>`;
    return;
  }

  grid.innerHTML = posts.map(post => `
    <a class="blog-card" href="post.html?post=${post.slug}">
      <div class="blog-card__meta">
        <span class="blog-card__tag">${post.category}</span>
        <span>${formatDate(post.date)}</span>
        <span>·</span>
        <span>${post.readTime}</span>
      </div>

      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>

      <div class="blog-card__footer">
        <span>Weiterlesen</span>
        <span>→</span>
      </div>
    </a>
  `).join("");
}

search?.addEventListener("input", renderPosts);

renderFilters();
renderPosts();
