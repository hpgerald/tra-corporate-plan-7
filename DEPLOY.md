# Deploying to GitHub Pages

This site is a static React + Vite app. It uses `base: './'` and a `HashRouter`,
which is what makes deep links work from a GitHub Pages project subpath
(`https://<user>.github.io/<repo>/`).

Your site will be live at: **https://hpgerald.github.io/tra-corporate-plan-7/**

## One-time setup

**0. Prerequisite:** install [Git](https://git-scm.com/downloads) and create a free
[github.com](https://github.com) account (if you don't have them).

**1.** Create a new **empty** repo on github.com named `tra-corporate-plan-7`
(no README, no .gitignore, no license).

**2.** In a terminal, from the project folder (`tra-corporate-plan-7/`):

```bash
git init
git add .
git commit -m "Dira-style explainer site"
git branch -M main
git remote add origin https://github.com/hpgerald/tra-corporate-plan-7.git
git push -u origin main
```

**3.** On github.com → your repo → **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

**4.** Open the **Actions** tab and wait for the "Deploy to GitHub Pages" run to
finish (green tick, ~1–2 min).

**5.** Your site is live at **https://hpgerald.github.io/tra-corporate-plan-7/**

## Updating later

Edit files, then:

```bash
git add .
git commit -m "Update"
git push
```

It redeploys automatically.

## Fallback (no GitHub Actions)

If you prefer not to use Actions:

```bash
npm install
npm run build
npm run deploy      # publishes dist/ to the gh-pages branch
```

Then Settings → Pages → Source: **Deploy from a branch → gh-pages**.

## SEO — after your first deploy

The site already ships: a descriptive title + meta description, Open Graph and
Twitter cards with a social image (`og.png`), a canonical URL, JSON-LD structured
data (WebSite, Dataset, Person), per-route document titles, a `robots.txt`, a
`sitemap.xml`, and a `<noscript>` fallback with crawlable content and links.

Once live, do these two things:

1. **Google Search Console** — add the property `https://hpgerald.github.io/tra-corporate-plan-7/`,
   then submit `sitemap.xml`.
2. **Test the social card** — paste your URL into the LinkedIn Post Inspector or
   the Facebook Sharing Debugger to confirm `og.png` renders.

**One SEO limitation to know.** This site uses a `HashRouter` (URLs like
`/#/targets`), which is the simplest, most robust setup for a GitHub Pages project
site — but search engines treat everything after `#` as the same page, so only the
home page is indexed as a distinct URL. The home page, structured data and noscript
fallback are optimised for this.

If you later want **every section indexed as its own URL** (`/targets`, `/plan/kpa1`,
etc.), switch to `BrowserRouter` with `basename="/tra-corporate-plan-7"` and add the
GitHub Pages SPA `404.html` redirect. It's a contained change — ask and it can be done.

## Local development

```bash
npm install
npm run dev       # dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

All data lives in `public/data/*.csv` — edit those and rebuild; no code changes needed.
