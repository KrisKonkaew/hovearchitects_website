# hovearchitects_mockup (Angular)

Clickable mockup of the HOVE Architects website, direction B "Image as Doorway", as an Angular 22 standalone app. By "developer". Same look and interactions as the earlier static mockup (kept in `legacy-static/`).

Content and images come from `docs/site-export/` (hovearchitects.com, exported 2026-10-19). Internal use only: image usage rights are unconfirmed. Do not push to the public web repo.

## Run

```
nvm use 24          # Node >= 24.15 (Angular 22)
npm install
npm start           # http://localhost:4200
npm run build       # dist/hovearchitects-mockup/browser
```

## Structure

| Path | What |
| --- | --- |
| `src/app/pages/` | home, projects (category filter, `#residential`/`#public`/`#competition`), project-detail, about, contact (lazy-loaded routes) |
| `src/app/layout/` | header, footer, lightbox (+ service) |
| `src/app/core/motion.ts` | `parallax`, `parallaxImg`, `.reveal`, `.hv` hover-pan directives, one shared scroll listener, `prefers-reduced-motion` respected |
| `src/app/core/data.service.ts` | typed access to `src/app/data/site-data.json` |
| `src/styles.css` | global design tokens and styles (unchanged from the static mockup) |
| `public/img/` | resized JPEGs, git-ignored, regenerate with the script below |
| `scripts/build-data.js` | regenerates `site-data.json` and `public/img` from `docs/site-export/` (macOS `sips`, paths are for this machine) |
| `scripts/build-mockup*.js`, `legacy-static/` | the old static HTML generator and its output |

Not real data (placeholders): address, email, phone, team, FAQ. The logo PNG still reads "ARCHITECTS / PORTFOLIO". Some source images are low resolution.
