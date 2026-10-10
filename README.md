# Loom India

A responsive fashion commerce and creative Atelier concept, with warm ivory/burgundy UI and sourced fashion photography in varied garment colors. The repository contains website code and its development documentation only. The UX portfolio is a separate deliverable.

## Preview and build

Requires Node.js 20 or newer. There are no runtime or build dependencies to install.

```sh
npm run dev
# Open http://localhost:4173
npm test
npm run build
node scripts/serve.mjs --dist
```

Stop the first server before serving the build on the same port. `dist/` is a deployable static website; any static hosting provider can serve it. Hash routes work under a repository subpath without server rewrites. Google Fonts are optional external requests with system font fallbacks. All photographs ship locally.

## Experiences

- Home and six discovery worlds: sarees, Indian wear, Indo-Western, everyday, festive, partywear.
- Catalog: combined category, search, budget and price sorting; empty state and reset.
- Product details: standard size chart, required size selection, bag and wishlist.
- Bag: quantity, removal and transparent checkout simulation.
- Loom Journal: two complete editorial stories.
- Curate Your Look: occasion, mood and budget produce a scripted edit of existing pieces.
- Create with Loom: free text inspiration, design families, fabric/sleeve/border choices, local image upload, scripted design brief, saved versions and comparison.
- Contextual fabric tool: usable length/width, standard sizing, custom chest/hip or previously saved fit; deliberately conservative illustrative rules.
- Optional designer consultation preview, with no booking submission.

## Honest boundaries

This is a production-style frontend concept, not a production commerce backend. The nine-item catalog, prices, fabric composition, product specifications and size chart are illustrative. Fashion reference photographs are style references, not exact SKU images. There is no model generation, image analysis, account, inventory, payment, order, shipping or designer booking integration. Interface labels make these boundaries explicit. Photo sources and terms are in `assets/CREDITS.md`.

Bag, wishlist and version briefs use browser localStorage. Custom fit storage is opt-in and unencrypted, and can be deleted from Fabric & fit. Upload previews use temporary object URLs on the current device; no upload is transmitted and images are not persisted with saved versions. Clearing browser storage clears saved data. The open brief survives route changes in the current visit; saved versions survive reloads.

The fabric estimate adjusts a sample base allowance by chest/hip and usable width, then adds 0.4 m. It cannot approve a garment. Fabric condition, stretch, motif placement, lining, pattern, actual fit and final pricing require professional review.

## Validation

`npm test` checks cross-category discovery, combined search/sort, fabric estimate behavior and invalid inputs, escaping, and size-chart monotonicity. Browser walkthrough evidence and final responsive checks are recorded in `QA.md`. No user interviews, usability study, conversion gains or production feasibility validation are claimed.

## Accessibility and motion

Semantic landmarks and headings, labeled native controls, keyboard-operable buttons, skip link, visible focus, polite status messages and native dialog focus management. Motion is limited to subtle hover transitions and honors reduced-motion preferences. A formal accessibility conformance audit and assistive-technology study remain future work.
