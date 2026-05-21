const article = document.querySelector("#postArticle");
const year = document.querySelector("#year");
const themeBtn = document.querySelector("#themeBtn");

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

function formatDate(dateString){
  return new Intl.DateTimeFormat("de-AT", {
    day:"2-digit",
    month:"long",
    year:"numeric"
  }).format(new Date(dateString));
}

const params = new URLSearchParams(window.location.search);
const slug = params.get("post");
const post = blogPosts.find(entry => entry.slug === slug);

if (!post) {
  document.title = "Blogpost nicht gefunden";
  article.innerHTML = `
    <h1>Beitrag nicht gefunden</h1>
    <p class="post-lead">Der gesuchte Blogpost existiert nicht oder wurde verschoben.</p>
    <p><a class="btn" href="blog.html">Alle Beiträge ansehen</a></p>
  `;
} else {
  document.title = `${post.title} – Blog`;
  article.innerHTML = `
    <div class="post-meta">
      <span class="blog-card__tag">${post.category}</span>
      <span>${formatDate(post.date)}</span>
      <span>·</span>
      <span>${post.readTime}</span>
    </div>

    <h1>${post.title}</h1>
    <p class="post-lead">${post.excerpt}</p>

    <div class="post-content">
      ${post.content}
    </div>
  `;
}
