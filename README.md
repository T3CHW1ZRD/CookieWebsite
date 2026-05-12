# Lailah's Cookies

Static React site for [@lailahscookies](https://www.instagram.com/lailahscookies) — gluten-free, almond-flour cookies made fresh to order.

Deployed to GitHub Pages from the `main` branch via GitHub Actions.

## Run locally

```bash
npm install
npm run dev
```

## Update content

Content lives in `src/data/seed.ts` (real cookie info) and `src/data/content.json` (optional override that the optional admin dashboard would write to). For typical edits, change `seed.ts` directly and push.

## Re-enable the owner dashboard

The site ships with a fully-built owner dashboard (`/admin`) that lets a non-technical user edit menu/gallery/pricing and publish to GitHub via a personal access token. It's gated behind an env flag so it doesn't ship in this client deploy.

To turn it back on for a future build:

1. Create `.env` (or `.env.local`) in this folder with:
   ```
   VITE_ENABLE_ADMIN=true
   ```
2. `npm run build` — the `/admin` route + dashboard code will be included.
3. The admin password lives in `src/admin/AdminGate.tsx` (`ADMIN_PASSWORD`).

## Deploy to GitHub Pages

The workflow at `.github/workflows/deploy.yml` runs on every push to `main`:

- `npm ci` + `npm run build`
- Uploads `dist/` to GitHub Pages

In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

The base path is set in `vite.config.ts` (`BASE_PATH`) and matched in `public/404.html`. Change both if you move the repo.
