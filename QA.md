# Validation record

10 October 2026. Local Codex in-app browser (Chromium), with desktop/mobile viewport overrides. Static build and Node test runner.

## Verified interactions

- Everyday filter returned three pieces; ascending-price order was ₹1,490, ₹1,890, ₹2,490.
- Search with no match displayed an empty state; reset restored all nine pieces.
- Adding a sized product without size displayed an error; selecting M added it to bag.
- Wishlist changed state; bag and saved version state survived a browser reload.
- Checkout explicitly stopped at a simulation; no payment or address was collected.
- Free text idea plus jacket/co-ord choices produced scripted briefs, saved two versions and compared them.
- Saved version selection restored the form and brief.
- Local JPG upload displayed a preview, with no server upload or AI analysis.
- Standard size M, 5.5 m length and 110 cm width estimated 5.3 m; personal chest 102/hip 110 estimated 5.9 m and displayed an insufficient-fabric caution.
- Opt-in custom fit could be reused on reopening the tool. A delete control is provided.
- Size chart opened inline while retaining the feasibility form.
- Optional designer preview clearly stated that no appointment was booked.
- Curate Your Look returned a festive edit within ₹7,000, with scripted styling suggestions.
- Escape dismissed a native dialog on mobile; navigation opened and closed.

## Responsive and asset checks

Desktop 1440 × 1000 and mobile 390 × 844 home/Atelier showed no horizontal document overflow. Final screen audit covered all nine routes at 320, 390, 768 and 1440 px. The initial audit found narrow-screen overflow in saved cards and the Atelier canvas; the grid was adjusted and rechecked. Screenshots are stored with the separate portfolio, never in this repository.

## Limits

Five automated domain tests pass. This is functional and visual QA, not user research, a formal WCAG certification, a cross-browser compatibility guarantee, or textile feasibility validation. Chrome could not be launched inside the shell sandbox, so interaction checks were run in the in-app browser. The three referenced fashion videos were unavailable in the cached conversation and local sources; they were not inspected. All final model imagery is sourced fashion reference photography, with credits; no generated model assets ship.
