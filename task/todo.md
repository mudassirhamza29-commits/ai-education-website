# AI Educational Website — Todo

## Checklist

- [x] Plan the page structure (sections, layout, color palette)
- [x] Set up HTML boilerplate with Google Fonts (Inter)
- [x] Build sticky dark nav with logo and links
- [x] Build hero section (headline, subtitle, CTAs, stats, grid background)
- [x] Add animated marquee ticker
- [x] Build courses grid (3 cards with placeholder images)
- [x] Build feature split section (text + image + icon list)
- [x] Build testimonials grid (3 quote cards)
- [x] Build CTA banner
- [x] Build footer
- [x] Make layout responsive at 768px

## Review

Single `index.html` file created at the project root. All CSS is inline in `<style>` — no external dependencies except Google Fonts and `picsum.photos` for placeholder images.

**Sections built:** Nav → Hero → Ticker → Courses → Features → Testimonials → CTA → Footer

**Design decisions:**
- Dark hero (`#0a0a0a`) with purple accent (`#6c63ff`) for the agency feel
- CSS grid lines and radial gradients as background texture (no images needed)
- `clamp()` for fluid typography, CSS custom properties for theming
- All hover states and transitions use `transform` + `box-shadow` (GPU-accelerated)

**No JS used** — pure HTML/CSS.
