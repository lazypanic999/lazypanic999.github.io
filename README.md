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

The portfolio features Itinerarium, OpsCommand, Open5GS + UERANSIM, Two-Server WordPress Lab and the early TunnelScope prototype. Team credits and prototype limitations are stated on the relevant cards. Itinerarium's AI integration is described from its repository, not attributed to the resume.

`projects.js` and `projects.css` provide bilingual screenshot galleries with keyboard navigation, focus restoration, real loading skeletons and error fallbacks. The 11 screenshots are original repository assets served locally without cropping. The original TunnelScope repository logo is retained among the source assets; its card now uses a separately labelled portfolio logo concept. `assets/projects/sources.json` records their public source URLs and SHA-256 hashes. Keep it and both caption translations in sync when changing an image.

Validated all 11 gallery images, project filters, TR/EN captions, keyboard controls, dark/light themes, 320/390 px layouts and local asset integrity.


## Editorial feedback

Applied Turkish/English editorial feedback to the engineering motto, screenshot labels, source captions, rebuildable 5G lab description, database terminology and early-stage prototype wording. Technical product names are preserved. The English 5G introduction is complete and matches the clarified Turkish description.

`assets/projects/tunnelscope-mark.svg` is a vector compass-and-spiral logo concept developed from the supplied editorial sketch. It is explicitly labelled as a concept rather than the original repository logo. Private review documents and working notes are not published. The existing source-asset manifest continues to describe original GitHub assets only.
