# How to Update the Lab Website

No build tools required. Edit files directly and push to `main` — GitHub deploys automatically within ~60 seconds.

---

## Adding yourself to People

1. Add your photo to `assets/images/people/yourname.jpg`
   - Square crop, at least 400×400px, JPG or PNG
2. Open `pages/people.html`
3. Find the right section (PhD Students, Masters & Undergrad, etc.)
4. Copy an existing `<div class="person-card">` block and fill in your details:
   - `src` → your photo filename
   - `alt` → your name
   - Name, role, research interest, email, and optional links
5. Commit and push

---

## Adding a publication

1. Open `pages/publications.html`
2. Copy an existing `<div class="pub-item">` block
3. Set `data-filter-val="YYYY"` to the publication year
4. Fill in: year, title, authors (bold your name with `<strong>`), venue, and links
5. Paste it at the **top** of `<div class="pub-list">` so it appears first
6. If it's a new year, add a filter button:
   ```html
   <button class="filter-btn" data-filter="YYYY">YYYY</button>
   ```
7. Commit and push

---

## Adding a news item

1. Open `pages/news.html`
2. Copy an existing `<div class="news-item">` block
3. Set `data-filter-val="YYYY"` to the year
4. Update the date (`Jun 2025` format) and the text
5. Paste it at the **top** of `<div class="news-list">` (newest first)
6. Also add it to the home page (`index.html`) in the Recent News section if it's one of the top 3 items
7. Commit and push

---

## Adding a software project

1. Open `pages/software.html`
2. Copy an existing `<div class="software-item">` block
3. Fill in name, description, tags, and links
4. Commit and push

---

## Adding a media item (press / talk / podcast)

1. Open `pages/media.html`
2. Find the relevant section (Press, Invited Talks, or Podcasts & Video)
3. Copy an existing row or card block and fill in the details
4. Commit and push

---

## Changing the lab name, color, or tagline

| What to change | Where |
|---|---|
| Lab name (nav + footer) | Every `<a class="nav-logo">` and `.footer-note` in all `.html` files |
| Accent color | `--accent` in `assets/css/style.css` line ~10 |
| Hero tagline | `<h1>` and `<p class="lead">` in `index.html` |
| Stats (papers, members…) | `.stats` section in `index.html` |
| Research themes | `.card-grid` section in `index.html` |

---

## Deployment

Every push to `main` triggers GitHub Actions → GitHub Pages.  
Check the **Actions** tab in the GitHub repo to see deploy status.  
The site URL is: `https://<org>.github.io/<repo>/`

### First-time setup (do once)
1. Go to repo **Settings → Pages**
2. Set Source to **GitHub Actions**
3. Push to `main` — it deploys automatically from then on
