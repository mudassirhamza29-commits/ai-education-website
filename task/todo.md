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

---

# Calendar App — Todo

## Checklist

- [x] **1. Create `calendar.html`** — HTML shell with header nav, calendar grid container, and modal markup
  - AC: File opens in browser without errors; header, grid area, and hidden modal are present in DOM

- [x] **2. Create `calendar.css`** — Styles for grid, day cells, event chips, modal, and responsive layout
  - AC: 7-column grid renders; today's date is highlighted; modal overlay is centered; layout adapts at ≤600px

- [x] **3. Implement `calendar.js` — State & rendering** — `currentDate`, `events` state; `renderCalendar()` builds correct grid for current month
  - AC: Grid shows correct number of days, correct starting weekday, and grays out days from adjacent months

- [x] **4. Implement month navigation** — `prevMonth()`, `nextMonth()`, `goToToday()`
  - AC: Prev/Next buttons change month; Today button jumps back to current month

- [x] **5. Implement add-event modal** — `openModal(date)` pre-fills date; form shows title, date, startTime, endTime, description
  - AC: Clicking an empty day opens modal with that day's date pre-filled

- [x] **6. Implement form validation** — Title required; endTime ≥ startTime when both provided
  - AC: Submitting empty title shows inline error and blocks save; invalid time range shows error

- [x] **7. Implement save event (create)** — `saveEvent()` creates new event object, pushes to array, persists to localStorage, re-renders
  - AC: Saved event appears as chip on the correct day cell; event survives page refresh

- [x] **8. Implement edit event** — Clicking an event chip opens modal pre-filled with that event's data
  - AC: All fields populate correctly; saving updates the existing event (not duplicate)

- [x] **9. Implement delete event** — Delete button in modal removes event from array, persists, re-renders
  - AC: Event disappears from grid immediately; does not reappear after refresh

- [x] **10. Responsive polish** — At ≤600px day cells shrink; long event chips become dot indicators
  - AC: Calendar is usable on a 375px-wide viewport without horizontal scroll

## Review

Three files created: `calendar.html`, `calendar.css`, `calendar.js`.

**What was built:**
- Month-view grid with correct weekday alignment and adjacent-month padding days
- Today's date highlighted with accent-color border
- Click any day → modal opens with date pre-filled
- Click an event chip → modal opens pre-filled for editing; Delete button visible
- Form validates title (required) and time range (end ≥ start)
- Events persisted to `localStorage` under key `calendar_events` as a JSON array
- Navigation: ← Prev, Today, Next → buttons update the rendered month
- Responsive: chips collapse to 8px dots at ≤600px; modal is full-width on mobile
- Escape key and backdrop click close the modal

**Design decisions:**
- Dark theme matching the existing Neuron project palette (`#6c63ff` accent)
- No frameworks or build tools — plain vanilla JS, zero dependencies
- IDs generated with `Date.now().toString(36) + random` (no crypto needed for local app)
- `toDateString()` helper ensures consistent `YYYY-MM-DD` comparison regardless of timezone
