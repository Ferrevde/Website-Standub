
## Project health
Standub is a stable, complete multi-page static site (7 routes + root). All technical pieces present: HTML, shared CSS, data file (src/data.js), nav, SEO metadata, responsive rules, accessibility basics. No backend, CMS, or dependencies. Visual identity exists but is explicitly not finalized per project brief — ready for deliberate art-direction phase.

## Existing strengths (preserve)
- Clean multi-page architecture with correct directory-based routing.
- Content separated from presentation (src/data.js for music/performance data).
- No invented factual content; all placeholders clearly marked.
- Semantic HTML (nav/main/section/article/footer), accessible navigation, reduced-motion support.
- Shared styles.css with variables, responsive breakpoints, reusable component classes.
- OG metadata, theme-color, lang=en, sitemap/robots not needed yet (static site, no production domain).
- README and project rules (.hermes.md / AGENTS.md) document purpose and constraints.

## Must fix (A) — done
- Duplicate class attribute on root intro (`container narrow`); fixed.
- Duplicate `class` on about (`layout-vertical`), music/workshops cards; fixed.
- CSS duplicate `.section-intro` (paragraph vs wrapper); fixed by using `.section-compact` for wrapper.
- `.media-placeholder` and `.media-placeholder-sm` overlap; merged into `.media-placeholder` (preserved 4/3 appearance), updated usages.
- Dead `.section-teaser` and `.pt-6` removed.
- No broken links, no missing sections, no invalid HTML (tag balance verified across all pages).

## Should improve (B)
- Add a `favicon` placeholder (currently none) — simple, improves polish.
- Add `/sitemap.xml` or at least confirm `robots.txt` when domain is known (optional, not blocking).
- Consider linking `src/data.js` into the HTML via a small helper or at least documenting the format clearly so the artist can edit without touching HTML; already structured well.
- Add `alt` descriptions to the media-placeholder `<div>` elements (they contain text, so accessible, but explicit `role="img" aria-label="..."` could help screen readers on placeholder blocks).
- The `contact` section links to `#contact` anchor rather than another page; acceptable, but if contact becomes more substantial a dedicated `/contact` page is already there.

## Optional (C)
- Add a simple `build`/`deploy` script or `wrangler.toml` for one-command Cloudflare deploy.
- Add `.gitignore` exclusions for `.env`/secrets (none present now, good practice).
- Minor typography refinements can wait for visual phase.

## Visual / art direction (D) — deferred, not changed
- Color palette, typography scale, hero composition, photographic direction, media artwork, animated motion details, poster/print extension.
- These are explicitly deferred per user instructions and should be handled in the upcoming visual-development prompts, not this audit.

## Changes made during this audit
- `styles.css`: merged `.media-placeholder` + `.sm`; removed dead rules; kept responsive @media; organized sections.
- `index.html`: fixed duplicate `class`; moved teaser headings to `.teaser-title`; placeholders to `.media-placeholder`; added `.section-intro`/`.section-compact` correctly; confirmed `style=` count = 0.
- `about/index.html`, `live/index.html`, `music/index.html`: cleaned editorial/end headings to reusable classes; fixed layout duplicates.
- Verified all 7 routes (home + 6 subpages) serve 200; server started/stopped cleanly; no content altered.

## Recommended next step
Proceed to the visual/art-direction phase (next prompt) — define the atmospheric/rhythmic identity with actual photography, release artwork, and refined typography — using the technically stable base established here.
