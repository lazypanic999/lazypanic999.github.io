# Doğukan Sağlık / lazypanic.dev

Personal engineering portfolio at [dogukansaglik.com](https://dogukansaglik.com/).

Bilingual Turkish/English content, dark/light liquid glass themes, current CV, project details, experience and certificate downloads. Built with plain HTML, CSS and JavaScript; no build or package installation required.

## Deployment

GitHub Pages serves the root of the `main` branch. `CNAME` preserves the custom domain and `.nojekyll` enables direct static publishing.

## Editing

- `index.html`: content; keep `data-tr` and `data-en` translations in sync.
- `style.css`: base layout and typography.
- `clear.css`: subtle transparent surfaces, prominent name, responsive layouts and animations.
- `app.js`: language/theme preferences, project filters and certificate links.
- `motion.js`: motion preferences, section reveals, pointer tilt and scroll progress.
- `assets/Dogukan-Saglik-CV.pdf`: current resume.
- `assets/dust-mites.TTF`: the original logo font.
- `certs/`: certificate PDFs.

Run `python -m http.server 4173` from the repository root to preview locally.

The wave button pauses continuous animation; the operating system's reduced-motion preference is respected. Glass panels have opaque fallbacks for browsers without backdrop blur. Email links open the visitor's email app. No form backend, tracking or credentials are included.


Document previews use the original PDFs plus 13 rendered page images in `assets/previews/`. `experience.js` provides a keyboard-accessible dialog, real loading skeletons and an error state; PDF download/new-tab links remain available. The preview manifest includes source SHA-256 values. Regenerate previews whenever replacing a PDF. Theme preference is applied before first paint; View Transitions provide the theme change animation, with reduced-motion handling.

## Selected projects and screenshots

The portfolio features TunnelScope, CorePulse, Itinerarium, OpsCommand, Open5GS + UERANSIM and Two-Server WordPress Lab. Team credits and prototype limitations are stated on the relevant cards. Itinerarium's AI integration is described from its repository, not attributed to the resume.

`projects.js` and `projects.css` provide bilingual screenshot galleries with keyboard navigation, focus restoration, real loading skeletons and error fallbacks. The galleries contain 13 original repository images, including screenshots and a labelled validation summary, served locally without cropping. The original TunnelScope repository logo is retained among the source assets; its card now uses the current blue project logo supplied by the user. `assets/projects/sources.json` records their public source URLs and SHA-256 hashes. Keep it and both caption translations in sync when changing an image.

Validated all 11 gallery images, project filters, TR/EN captions, keyboard controls, dark/light themes, 320/390 px layouts and local asset integrity.


## Editorial feedback

Applied Turkish/English editorial feedback to the engineering motto, screenshot labels, source captions, rebuildable 5G lab description, database terminology and early-stage prototype wording. Technical product names are preserved. The English 5G introduction is complete and matches the clarified Turkish description.

`assets/projects/tunnelscope-mark.svg` is a vector compass-and-spiral logo concept developed from the supplied editorial sketch. This earlier concept has been superseded in the project card by the user-provided blue project logo. Private review documents and working notes are not published. The existing source-asset manifest continues to describe original GitHub assets only.


The current TunnelScope card uses `assets/projects/tunnelscope-logo-blue.png`, preserved byte for byte from the user-provided file. CSS frames its transparent margins while retaining its original colours in both themes. `assets/projects/brand-assets.json` records provenance, dimensions and SHA-256. The card caption and image alt text identify it as the project logo in both languages.


## GitHub refresh on 29 October 2026

TunnelScope now reflects the verified v0.4.1 alpha release on GitHub and PyPI: IPv4/IPv6 UDP probes, bounded sweeps, receiver correlation, separately measured directions and offline HTML reports. Its new two-image gallery shows the repository's report UI and controlled two-VM validation summary. The 24/24 observation is limited to that Ubuntu–Debian lab and does not establish an exact path MTU or automatic root-cause diagnosis. The blue project logo is preserved.

CorePulse is presented as early Go development with read-only discovery and a guarded pod-failure workflow in code. Live-cluster validation is pending; telemetry collection, a trained ML model and the dashboard remain planned. The original repository logos adapt to the site's theme.

There are now 6 projects and 13 images across 4 galleries. `assets/projects/sources.json` records 16 original repository assets; `project-sources.json` records source-document blob SHAs. Other existing project repositories had no changes in this review.


## Studio design — 31 October 2026

`studio.css` adds the midnight/electric-blue/cantaloupe dark palette and white/sky-blue/hot-pink light palette. The personal workspace dashboard links to actual projects and provides toolkit and approach tabs; it contains no simulated telemetry. `studio.js` implements tab selection with Arrow, Home and End keyboard support. The responsive two-column project grid collapses on small screens. Existing content, bilingual labels, document/gallery dialogs and motion preferences remain available. Versioned stylesheet/script URLs prevent stale project styling after publication.

Static asset integrity, HTML structure and JavaScript syntax were checked. Browser visual QA was unavailable because the Windows browser tool could not verify its current URL; responsive layouts and visual appearance still need a browser review.


## Signal refinement — 31 October 2026

Replaced the workspace dashboard and signature with a CSS orbital sculpture around the original wordmark. Orbital trails, particles, floating labels and entry/reveal motion obey the animation toggle and reduced-motion preference; off-screen sculpture animation pauses. Dark mode uses warm near-black with restrained blue, while light mode has stronger pink/sky-blue tinted surfaces. TunnelScope and CorePulse are featured; four supporting projects use native expandable details with their original galleries, attribution and technical notes retained. Browser visual QA remains unavailable due the existing browser tool URL-verification limitation.


## Palette correction — 31 October 2026

Dark: midnight black #07070a, primary electric blue #0097de, secondary cantaloupe orange #fc734d. Light: white #fcfcff, primary sky blue #008cb8, secondary hot pink #de3695. Primary buttons, logo suffix, active filters, project labels and orbital trails use blue; warm colours are reserved for smaller details. Removed the pink wash from the light background. No layout or content changes. Browser visual QA remains unavailable; source palette and live asset checks verify this correction.


Electric-blue background lighting: layered #0097de radial shadows now fill both theme backdrops, with stronger dark-theme and softer white-theme opacity. Existing content, accent roles and motion controls are unchanged.

Light-theme lighting also includes subtle hot-pink #de3695 shadows beside the blue lighting, preserving the white base.


## Uploaded liquid-glass integration — 31 October 2026

`liquid-glass.js` adapts the user-provided JavaScript (original SHA-256 `14c32f331c0c80dd4cce120c9ee73fee1e3e540fb3674560e0d5601ffeb76763`). It adds glass rims, ambient blobs, pointer spotlights, restrained card tilt, button glints, staggered hero/reveal effects, word-level heading entrances and Chromium backdrop refraction. Existing colours and compact typography are retained; card selection uses explicit portfolio selectors rather than layout heuristics. Existing motion controls govern the new layer. The original progress element is reused. Translated headings are rebuilt with accurate accessible labels. Existing reveal animation yields to this layer. No new external font or runtime library is loaded.

Validation: JavaScript syntax, asset integrity and DOM integration with normal/reduced motion; filters, TR/EN heading labels, pause/reset behaviour, compact project count, single background/progress and repeat initialization. DOM tests ran outside the shipped checkout. This does not replace visual browser QA, which remains unavailable due the browser URL-verification limitation.
