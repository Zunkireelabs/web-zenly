# Zennly Landing Page — Design Brief & Content Plan

**Status:** Approved (reflects the live homepage as of this update)
**Last updated:** 2026-10-25
**Built by:** Zunkireelabs

> **Source-of-truth note:** This revision documents the homepage **as actually implemented** in `src/index.njk`, so it can be linked from the design skill as the reference for building out remaining pages. Two caveats carried over from the source file itself:
> 1. `index.njk` labels its own CSS "page-local design tokens — deliberately NOT the Zennly design system... an experimental structural reference, never shipped as-is." Treat the tokens below as *current*, not necessarily *final*.
> 2. Several content blocks (result-stat marquee, testimonial quotes, review badges/snippets) are marked `PLACEHOLDER` in the source and are due to be swapped for real customer data before launch — don't treat that copy as approved final copy, only as the current structural stand-in.

---

## 1. What We're Building and Who It's For

**Product:** Zennly — a multi-tenant booking and operations platform. Not a calendar widget. Three value pillars: online booking (customer-facing 6-step flow) + operational control (staff/manager dashboards, real-time scheduling) + financial clarity (daily revenue reconciliation, discount audit trail, payment breakdown). Replaces Excel + phone bookings + disconnected tools with one system.

**Buyer (landing page target):** Service business owners and branch managers — spa owners, salon operators, clinic managers — who are currently running operations on Excel and managing bookings by phone. They feel the pain of manual reconciliation, double-bookings, no audit trail.

**End user (secondary):** Their customers, who want to book online without calling.

**Stage:** One live tenant — Nuad Thai Spa, Kathmandu (39 therapists, 12 rooms, 194 services). Positioning globally, not Nepal-only.

**What we're NOT building:** A Calendly-style lightweight scheduling tool, a consumer marketplace (Fresha/Treatwell), or a POS system (Square).

---

## 2. Current Design Direction (as implemented)

### Color tokens

Defined as `--v2-*` custom properties — shared ones in `main.css` (`:root`), with page-local overrides inside `index.njk`:

| Token | Hex / value | Usage |
|-------|-----|-------|
| `--v2-bg` | `#FFFFFF` (base layer `--color-bg` = `#FAFAF9`) | Page background |
| `--v2-card` | `#FFFFFF` | Cards, panels |
| `--v2-ink` | `#2E1919` | Primary text — warm near-black, not pure black |
| `--v2-ink-soft` | `rgba(46,25,25,.62)` | Body/secondary text |
| `--v2-muted` | `rgba(46,25,25,.42)` | Muted text |
| `--v2-line` | `rgba(46,25,25,.12)` | Borders/dividers |
| `--v2-sage` | `#3F6839` (= `--color-primary`) | Logo color, CTA accent in the "practice" section |
| `--v2-cta` | `#1C1C1C` | Primary button fill, sitewide |
| `--v2-cta-hover` | `#000000` | |
| `--v2-cta-soft` | `rgba(28,28,28,.06)` | Secondary/ghost button fill |
| `--v2-accent` / `--v2-bg-alt` | `#ECF7BD` (lime) | Hero CTA fill, italic-accent text background, access-card bg |
| `--v2-accent-ink` | `#2E1919` | Text on lime accent |
| `--v2-cream` | `#F7F6F5` | Alternate section background ("sheets") |
| `--v2-link` | `#38430A` (dark olive) | Sitewide default final-CTA band color (overridden on homepage, see below) |
| `--v2-live-dot` | `#22c55e` | Footer "All systems operational" pulse dot |

**Homepage-only overrides** (page-local, not the sitewide default):
- Final CTA band (`#v2-access`) and footer-flow wrapper: pink/mauve/plum gradient (`#D27BB0`, `#B996D9`, `#E79A7C`, `#CF8E95`→`#D99A8C`) with a film-grain overlay, replacing the sitewide dark-olive band.
- Homepage footer is forced **white** (`#fff` bg, dark ink text) instead of the sitewide default black footer (`#0C0D0C` bg, `#F4F3EE` text).
- The full-bleed "One system. Every branch." practice section uses its own deep-forest-green mesh (`#3A6A34` → `#4E8442` → `#7AA95A` → `#B9DA80` → `#E2F1B6`) with lime/gold radial glows and grain.

No gradients/dark theme in the *shared* default; the homepage itself currently deviates from that default in three places (CTA band, footer, practice section) — flag before reusing on other pages.

### Typography

Google Fonts loaded sitewide: DM Sans, Baloo 2, JetBrains Mono, Inter Tight, Instrument Serif. The homepage only actually uses two of them:

| Level | Font | Size | Weight |
|-------|------|------|--------|
| H1 (hero) | Inter Tight | `clamp(40px, 5.56vw, 80px)`, line-height .95 | 600 |
| H2 (sections) | Inter Tight | `clamp(34px, 4.44vw, 64px)`, line-height 1 | 600 |
| H3 (cards/panels) | Inter Tight | `clamp(24–28px, ~2.6vw, 36–40px)` (hand-set per block) | 600 |
| Body | Inter Tight | 18px base (`1.125rem`), line-height 1.6; 16–17px in panels | 400–500 |
| Hero lede | Inter Tight | `clamp(19px, 1.5vw, 26px)` | 400/500 |
| Italic accent words | Instrument Serif | inline with heading size | — used only for `<em>` accent words inside headlines (e.g. the cycling hero word, "finally here.", "Trusted by *owners*") |
| Data / stats | Inter Tight (sans) | varies | 600 |

**Note:** JetBrains Mono is loaded sitewide but is **not used anywhere on the current homepage** — all numeric/stat display (hero rating, dashboard mock numbers, story stats) uses the sans font. Playfair Display is no longer used on the homepage.

### Structure and components

- **3-zone nav** (floating pill, fixed position): logo | 3 mega-menu triggers (Capabilities / Types / Resources) | Login (ghost) + "Try a free demo" (solid)
- Nav starts transparent → `.is-scrolled` gains `background: rgba(255,255,255,.6)` + blur; mega-menu open state goes fully solid with a page-wide blur backdrop
- Container max-width `1440px`, content max-width `1232px` (`1440px` minus fluid gutter), gutter `clamp(16px, 7.22vw, 104px)` (flat `16px` below 860px)
- Alternating zigzag 2-column panels for the "outcomes" tabs and bento feature grid
- Section backgrounds alternate between white and `--v2-cream` ("sheets")
- Bottom CTA band is visually distinct from the hero (pink/mauve gradient), not a mirror of it
- Scroll-scrubbed horizontal carousels used for industries, testimonials, and marquees (not static grids)

### Spacing and micro-details

- Section vertical padding: `clamp(88px, 10vw, 144px)` top/bottom per "sheet" section
- Heading-to-content gap: `clamp(40px, 3.9vw, 56px)`
- **Button radii:** `14px` (`--v2-btn-r`) for primary/secondary rectangular buttons; `999px` (`--v2-r-pill`) for pill CTAs (hero lime button, nav icon buttons, badges)
- **Card radii:** `24px` (bento/industry/story cards), `18px` (callout/access cards), `16px` (dashboard mockup image), `36px` (phone mockup)
- **Section "sheet" radius:** `clamp(32px, 4.4vw, 64px)` for the rounded tops that overlap the section above
- Footer: "● All systems operational" status line with a pulsing green dot, kept from the original direction
- No public pricing on the homepage itself — only a footer link to `/pricing/`

### The Signature Element

**Product UI as the anchor, but as a looping hero video, not a static booking-flow screenshot.** The hero shows an autoplaying muted looping product video (not a step-by-step booking flow image). Further down, the "outcomes" tabs and "practice" section carry static dashboard/phone mockups instead. No device-frame chrome around any of it.

### Deliberately NOT Doing (still holding)

- No purple, blue, or teal
- No device mockup frames around product screenshots
- No "simplest booking app" or Calendly-lightweight positioning
- No generic calendar iconography
- No pure `#000000` text anywhere (ink is `#2E1919`)

### No longer true (superseded)

- ~~Zero gradients~~ — the CTA band, footer-flow, and practice section all now use gradients/mesh backgrounds.
- ~~Zero dark theme~~ — sitewide default footer/CTA band is dark (`#0C0D0C` / `#38430A`); the homepage specifically opts back out of dark into pink/white, but dark is now the system default elsewhere on the site.
- ~~Playfair Display for H1~~ — replaced by Inter Tight; Instrument Serif now carries the one "editorial" accent via italic inline words only.
- ~~Earth brown `#8B4513` / gold `#DAA520` accents~~ — not present in the current token set; lime `#ECF7BD` and sage `#3F6839` are the accent colors now.

---

## 3. Section Order (13 sections, as currently implemented)

| # | Section | Notes |
|---|---------|-------|
| 1 | **Nav** | Logo (image or "Zennly" sage-green text) \| Capabilities / Types / Resources mega-menus \| Login (ghost) + "Try a free demo" (solid) |
| 2 | **Hero** | Rating row ("4.9 ★★★★★ from 120+ reviews", placeholder) → H1 with cycling italic word → lede → email-capture form → autoplaying looping product video |
| 3 | **"Grow like these businesses"** | Horizontal marquee, 6 placeholder photo+stat cards (e.g. "+38% Online bookings — Spa owner, Lazimpat") |
| 4 | **Outcomes tabs** | H2 + 4 auto-advancing tabs (More online bookings / Zero double-bookings / Faster daily close / Discount control), each with eyebrow/H3/body/chip-list + product screenshot |
| 5 | **"One system. Every branch."** | Full-bleed dark forest-green band; dashboard + phone mockup with 4 floating callouts (Bookings, Discount Control, Payments, Staff Transfers) |
| 6 | **Bento feature grid** | 1 full-width photo card + 2 animated UI-story cards + 1 photo card w/ animated notification bell |
| 7 | **Industries carousel** | H2 "One platform, every service business" — scroll-scrubbed cards: Spa & Wellness, Fitness & PT, Hair Salon, Physiotherapy, Cleaning Service, Tattoo Studios → "Explore all industries →" |
| 8 | **Testimonial carousel** | Placeholder, 3 draggable quote cards with stat pairs + "Read the story →" links |
| 9 | **Ratings/reviews band** | Placeholder badges (Capterra 4.9, G2 High Performer) + 2 auto-scrolling marquee rows of review snippets |
| 10 | **"3 beliefs"** | 3 belief blocks (numbers close themselves / controls not trust-me / software speaks your business) |
| 11 | **Free guides grid** | 4 tiles linking to blog posts + "Learn with Zennly" tile |
| 12 | **Final CTA / "access" band** | Pink/mauve gradient band: H2 + "Try a free demo" / "Talk to us" CTAs + reassurance line + floating stat-card gallery around a phone mockup |
| 13 | **Footer** | Logo + CTAs, 2×4-column link grid, tagline, "● All systems operational", legal links |

No standalone "4-number stats band" exists anymore — stat numbers are distributed across the results marquee, the access-band cards, and the practice-section dashboard mock.

---

## 4. Hero Headline (as implemented)

**Headline:**
> "Built for the businesses that run without the *chaos*" (italic word cycles via JS)

**Lede:**
> "Booking software for spas, salons and gyms in Nepal: online booking, operational control and financial clarity."

**CTA:** Email-capture form, submit label "Book a free demo →" (no secondary "See It Live" link on the hero itself — that pattern moved to the testimonial cards' "Read the story →" links).

**Meta/trust signal:** "4.9 ★★★★★ from 120+ reviews" (placeholder, sits above the headline, not below the CTA).

**Hero layout:** Still left-aligned/asymmetric, but the visual anchor is now an autoplaying looping product **video**, not a static full-width booking-flow screenshot.

> Note: the original approved headline ("Your customers book online. Your team runs smarter.") and subhead have been superseded by the copy above. If that reflects a deliberate copy decision, no action needed — flagging only because it differs from what this brief previously recorded as "Approved."

---

## 5. Content Spec

### Value Prop Framing
No single framing sentence is rendered verbatim on the current homepage (the old "operating system for your service business" line is not present as page copy). The closest equivalent is the "3 beliefs" section (see below) and the outcomes-tabs framing ("more bookings, fewer gaps, a faster close").

### Social Proof (still PLACEHOLDER — not yet swapped for real data)

**Testimonial carousel (3 cards):**
> "Zennly is the first system our whole team actually uses: front desk, therapists and me." — Owner name, Spa owner, Kathmandu

> "I see every branch from my phone. I stopped calling managers for the numbers." — Owner name, Salon group owner, Lalitpur

> "Discounts used to disappear. Now every one has a reason and an approval." — Manager name, Clinic manager, Pokhara

**Results marquee (6 cards):** "+38% Online bookings" (Spa owner, Lazimpat) · "30 sec Daily close" (Studio manager, Thamel) · "NPR 2.4L Leakage recovered" (Salon owner, Jhamsikhel) · "4 branches One dashboard" (Barbershop group, Kathmandu) · "0 Double-bookings" (Beauty clinic, Pokhara) · "2 hrs Saved every day" (Fitness studio, Lalitpur)

**Review badges (placeholder):** "Capterra · 4.9 rating", "G2 High Performer, Fall 2026", "4.9 ★★★★★ across 120+ reviews"

The Nuad Thai Spa / Anish M. testimonial and the 3,200+/194/39/30-sec stats block from the original brief are **no longer on the homepage** — they may still be accurate for the case-study page, but are not what's live here.

### Pricing Section
Not present on the homepage. A footer link points to `/pricing/`; that page should be treated as the source of truth for pricing copy/model, not this brief.

### Vertical Section (Industries carousel)
- **Cards shown:** Spa & Wellness, Fitness & PT, Hair Salon, Physiotherapy, Cleaning Service, Tattoo Studios (two of these currently use stock Unsplash images rather than local brand photography)
- **No separate "featured vs. overflow" split** — all are shown in one scroll-scrubbed carousel, ending in an "Explore all industries →" link to `/solutions/`

---

## 6. Resolved Decisions (as implemented)

| Question | Decision |
|----------|----------|
| Pricing model | No pricing on the homepage at all — deferred entirely to `/pricing/` (footer link only) |
| Primary hero CTA | "Book a free demo →" via email-capture form (not a link to a separate contact page) |
| Nav/footer CTA | "Try a free demo" (solid) + "Login" (ghost) in nav; "Try a free demo" + "Talk to us" in footer/final CTA |
| Geographic positioning | **Nepal-specific in the hero lede** ("spas, salons and gyms in Nepal") — supersedes the earlier "Global, no geographic framing" decision |
| Brand name | Just "Zennly" — still holds |
| Vertical focus | Carousel of 6 (Spa & Wellness, Fitness & PT, Hair Salon, Physiotherapy, Cleaning Service, Tattoo Studios) — no featured/overflow split; Dental Clinic is not currently shown on the homepage |
| Social proof | Still placeholder (3 different owner/manager quotes, not the Nuad Thai/Anish M. quote) — swap before launch still applies |
| Logo | Image logo (`/assets/images/logo.png`) with a sage-green text-logo fallback — supersedes "text wordmark only, no image asset" |
| Live demo URL | Not referenced on the homepage currently; nav "Login" points to `https://app.zennly.io/login` |

---

## 7. Conflict Resolutions

| Conflict | Resolution (current) |
|----------|-----------|
| Button radius | `14px` for rectangular buttons, `999px` (full pill) for CTA/badge buttons — supersedes the earlier 8px/16px split |
| Accent color risk in SaaS context | Lime (`#ECF7BD`) is the only non-neutral accent used as a fill (hero CTA, callouts); sage green (`#3F6839`) is reserved for logo + one section's CTA — gold/brown are no longer part of the palette |
| Hero alignment | Still left-aligned/asymmetric, buyer-first — holds from the original Sierra-vs-Raycast resolution |
| Dark vs. light final CTA / footer | Sitewide default is now dark (`#0C0D0C` footer, `#38430A` CTA band); the homepage opts back out to white footer + pink/mauve CTA band — if propagating to new pages, confirm which treatment (sitewide dark default, or homepage's light override) is intended before copying either one |

---

## 8. Reference Files

| File | Purpose |
|------|---------|
| `docs/CONTEXT.md` | Full product context, audience, features, brand colors |
| `INSPO_01_fresha.md` | Content audit — Fresha (consumer marketplace) |
| `INSPO_02_treatwell.md` | Content audit — Treatwell (consumer marketplace) |
| `INSPO_04_square.md` | Content audit — Square Appointments (feature + pricing reference) |
| `INSPO_05_trafft.md` | Content audit — Trafft (positioning + copy reference) |
| `DESIGN_01_sierra.md` | Design audit — Sierra (color, typography, theme) — **historical**, no longer reflects the live homepage |
| `DESIGN_02_raycast.md` | Design audit — Raycast (components, layout, structure) — **historical**, no longer reflects the live homepage |
| `DESIGN_03_resend.md` | Design audit — Resend (pricing layout, spacing, micro-details) — **historical**, no longer reflects the live homepage |
| `src/index.njk` | **Current source of truth** for all homepage tokens, copy, and structure documented above |
| `src/assets/css/main.css` | Shared `--v2-*` tokens and sitewide nav/footer styling |
