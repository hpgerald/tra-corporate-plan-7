# CP-7 Explained — build, run & deploy (VS Code → GitHub Pages)

A complete, copy-paste guide: from opening the project in VS Code, to running it
locally, to publishing it live on GitHub Pages via the **gh-pages branch**
(not GitHub Actions), to the SEO steps to do afterwards.

Your site will be live at: **https://hpgerald.github.io/tra-corporate-plan-7/**

---

## 1. What you'll need (one-time installs)

| Tool | Why | Get it |
|---|---|---|
| **Node.js** (LTS, v18+) | Runs the build | https://nodejs.org — install the "LTS" version |
| **Git** | Version control + pushing to GitHub | https://git-scm.com/downloads |
| **VS Code** | The editor | https://code.visualstudio.com |
| **GitHub account** | Hosting | https://github.com |

Check Node and Git are installed — open a terminal and run:

```bash
node -v
git -v
```

Both should print a version number.

---

## 2. Open the project in VS Code

1. Open **VS Code**.
2. **File → Open Folder…** and choose the `tra-corporate-plan-7` folder.
3. Open the built-in terminal: **Terminal → New Terminal** (or `` Ctrl+` ``).
   All commands below run in this terminal.

> Optional but nice: when VS Code offers "recommended extensions," ESLint and
> Prettier are handy. Not required to build or deploy.

---

## 3. Install dependencies & run locally

```bash
npm install
```

This downloads everything into a `node_modules/` folder (git-ignored). Then start
the dev server:

```bash
npm run dev
```

VS Code will show a local URL (usually `http://localhost:5173`). **Ctrl+click** it
to open the site in your browser. Edits to files in `src/` or `public/data/` refresh
live. Press **Ctrl+C** in the terminal to stop the dev server.

To preview the real production build locally:

```bash
npm run build      # outputs the static site to dist/
npm run preview    # serves dist/ so you can check it before deploying
```

> **Editing the data:** every figure lives in `public/data/*.csv`. Change a CSV,
> save, and the site updates — no code changes needed.

---

## 4. Put the project on GitHub

**a.** On https://github.com, create a **new, empty** repository named
`tra-corporate-plan-7` — **no** README, `.gitignore`, or license (leave them
unchecked).

**b.** Back in the VS Code terminal, from the project folder:

```bash
git init
git add .
git commit -m "CP-7 explainer site"
git branch -M main
git remote add origin https://github.com/hpgerald/tra-corporate-plan-7.git
git push -u origin main
```

(If Git asks you to sign in, follow the browser prompt to authorise GitHub.)

Your source code is now on GitHub on the `main` branch.

---

## 5. Deploy to GitHub Pages (gh-pages branch)

This project publishes the built site to a separate `gh-pages` branch. The
`deploy` script builds first, then pushes `dist/` to that branch for you.

**a.** Run:

```bash
npm run deploy
```

This runs `npm run build` automatically, then publishes `dist/` to a new
`gh-pages` branch on GitHub. Wait for it to finish ("Published").

**b.** On github.com → your repo → **Settings → Pages**:

- Under **Build and deployment → Source**, choose **Deploy from a branch**.
- Set **Branch** to **`gh-pages`** and the folder to **`/ (root)`**.
- Click **Save**.

**c.** Wait ~1–2 minutes, then open:

**https://hpgerald.github.io/tra-corporate-plan-7/**

Done. 🎉

---

## 6. Updating the site later

Any time you change files:

```bash
git add .
git commit -m "Describe your change"
git push                 # saves your source on main
npm run deploy           # rebuilds and republishes the live site
```

The live site refreshes within a minute or two.

---

## 7. SEO — do these once it's live

The site already ships strong SEO defaults: a descriptive title + meta
description, Open Graph & Twitter cards with a social image (`og.png`), a
canonical URL, JSON-LD structured data (WebSite, Dataset, Person), per-page
titles, `robots.txt`, `sitemap.xml`, and a `<noscript>` fallback with crawlable
content and links.

After deploying:

1. **Google Search Console** — go to https://search.google.com/search-console,
   add the URL-prefix property `https://hpgerald.github.io/tra-corporate-plan-7/`,
   verify it (the easiest method here is an HTML meta tag — paste it into the
   `<head>` of `index.html`, redeploy, then click Verify), and then **submit
   `sitemap.xml`** under Sitemaps.
2. **Bing Webmaster Tools** (optional) — https://www.bing.com/webmasters, same idea.
3. **Test the social card** — paste your URL into the
   [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and the
   [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to
   confirm `og.png` renders. (These also refresh their cached preview.)

### One SEO limitation to know

The site uses a **HashRouter** (URLs look like `/#/targets`). This is the simplest,
most reliable setup for a GitHub Pages project site, but search engines treat
everything after `#` as the same page — so only the **home page** is indexed as a
distinct URL. The home page, structured data, and noscript fallback are optimised
for exactly this.

If you later want **every section indexed as its own URL** (`/targets`,
`/plan/kpa1`, …), that means switching to `BrowserRouter` with
`basename="/tra-corporate-plan-7"` plus a GitHub Pages `404.html` SPA-redirect.
It's a contained change — ask and it can be done.

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| **Blank page after deploy** | Make sure Pages **Source** is `gh-pages` / `root`, and give it 1–2 min. The project already uses `base: './'`, which is required for a subpath. |
| **CSS/JS 404s** | Confirm you deployed with `npm run deploy` (which builds first). Don't upload `dist/` by hand. |
| **`gh-pages` command not found** | Run `npm install` first — it's a dev dependency. |
| **Push rejected / auth error** | Re-run the browser sign-in when Git prompts, or set up a GitHub Personal Access Token. |
| **Changes not showing** | You pushed source but didn't redeploy — run `npm run deploy` again; also hard-refresh (Ctrl+Shift+R). |

---

## Notes

- `node_modules/`, `dist/`, and the `*-preview.html` scratch files are git-ignored.
- There's a disabled GitHub Actions workflow in `.github/` kept manual-only so it
  never conflicts with branch deployment — you can delete the `.github/` folder if
  you prefer a cleaner repo.
- All data is open CSV in `public/data/` — the single source of truth for the site.
