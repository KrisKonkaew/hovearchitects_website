# hovearchitects_mockup

Clickable static mockup of the HOVE Architects website. By "developer" · 2026-10-19.
Direction **B "Image as Doorway"** from the first set of directions by "designer" (`context/design/drafts/hove-design-directions.pdf`): transparent header over full-screen images, one panel per category with a pill in the middle, numbers 01, 02… per category, no sheet codes, built from the content and images that "marketer" exported to `docs/site-export/`.

Not the Angular app: plain HTML/CSS/JS, no build step, no Firebase.

**Photos are not in this repo** (they belong to HOVE and publishing rights are unconfirmed, `assets/img/` is git-ignored). Without them the pages open but show broken images. Regenerate them with `node scripts/build-mockup.js` (needs macOS `sips` and the project's `docs/site-export/` folder; set `HOVE_ROOT` if it is not four levels above `mockup/`).

## Open it

After regenerating the photos, double-click `index.html`, or `npx serve .` / `python3 -m http.server` in this folder. Fonts (Montserrat, IBM Plex Sans Thai) load from Google Fonts, so it needs internet for correct type.

## Pages (27)

| File | Content |
| --- | --- |
| `index.html` | Home: hero, studio intro, selected projects, 3 category panels |
| `projects.html` | 23 projects in 3 categories, category filter (also `#residential`, `#public`, `#competition`) |
| `projects/{slug}.html` ×23 | Project page: hero, lead, facts, text, gallery + lightbox, drawings, next / prev |
| `about.html`, `contact.html` | Studio text and 3 portraits · Facebook only (other contact details are placeholders until HOVE confirms) |

## Home page interactions

| Where | Hover (mouse) | Scroll |
| --- | --- | --- |
| Hero | Nothing extra on hover | Background moves slower than the page, title moves faster and fades |
| Selected projects (6 strips) | Hovered strip expands, goes from black and white to colour, shows number, name and location | Reveals on entering the viewport |
| Category panels (×3) | Image pans with the mouse and zooms slightly, shade lightens, pill fills white | Image slides at a different speed from the panel (parallax) |
| Project pages | Gallery images pan with the mouse; click opens a lightbox | Each gallery image and the hero slide with parallax |

Accessibility and robustness: all text is in the HTML (the filters only show/hide); `prefers-reduced-motion` turns off parallax and transitions.

## What is real

- Real: titles, locations, descriptions, client / co-design / area / award where the source text states them, all images (resized to 1600 px and 800 px JPEG in `assets/img/`). Numbers follow the order inside each category.
- Not shown because the source has no data: year, status, summary, climate strategies, credits.
- The logo image still reads "ARCHITECTS / PORTFOLIO" (the original PNG).
- Images are the web-size files from hovearchitects.com (hero needs 2400 px); some (Ban Chom Le, Matter Ngamwongwan) look soft when full-screen. Ask HOVE for originals.
- The earlier version with sheet codes, callouts and climate tags (the "designer" set-3 look) is kept as `scripts/build-mockup-set3.js`.

## Rebuild

`node scripts/build-mockup.js` regenerates all pages and image sizes from `docs/site-export/`.
