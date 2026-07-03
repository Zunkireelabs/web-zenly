# Zenly Landing Page — Design Brief & Content Plan

**Status:** Approved  
**Last updated:** 2026-06-11  
**Built by:** Zunkireelabs

---

## 1. What We're Building and Who It's For

**Product:** Zenly — a multi-tenant booking and operations platform. Not a calendar widget. Three value pillars: online booking (customer-facing 6-step flow) + operational control (staff/manager dashboards, real-time scheduling) + financial clarity (daily revenue reconciliation, discount audit trail, payment breakdown). Replaces Excel + phone bookings + disconnected tools with one system.

**Buyer (landing page target):** Service business owners and branch managers — spa owners, salon operators, clinic managers — who are currently running operations on Excel and managing bookings by phone. They feel the pain of manual reconciliation, double-bookings, no audit trail.

**End user (secondary):** Their customers, who want to book online without calling.

**Stage:** One live tenant — Nuad Thai Spa, Kathmandu (39 therapists, 12 rooms, 194 services). Positioning globally, not Nepal-only.

**What we're NOT building:** A Calendly-style lightweight scheduling tool, a consumer marketplace (Fresha/Treatwell), or a POS system (Square).

---

## 2. Approved Design Direction

### From Sierra — Color and Theme

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#FAFAF9` | Page base (warm off-white) |
| Surface | `#FFFFFF` | Cards, panels |
| Text primary | `#302E2D` | All body text, headings — NOT pure black |
| Brand green | `#2D5A27` | Primary CTA, links, accents |
| Accent gold | `#DAA520` | Micro-accent only: 1 stat, badge highlight, hover underline |
| Earth brown | `#8B4513` | Footer, secondary nav, small labels only — never hero |
| Muted | `#716F6C` | Subheadlines, labels, metadata |
| Ghost surface | `#F0EDE8` | Secondary button bg, alternate section bg |

- Zero gradients, zero decoration, zero dark theme
- Playfair Display for H1 hero (editorial serif = premium signal)
- Rounded CTA buttons in brand green

### Typography

| Level | Font | Size | Weight |
|-------|------|------|--------|
| H1 (hero) | Playfair Display | 88px | Bold |
| H2 (sections) | Inter | 52px | Semibold |
| H3 (cards) | Inter | 22px | Semibold |
| Body | Inter | 17px | Regular |
| Data / stats / prices | JetBrains Mono | varies | Medium |
| Labels / badges | Inter | 12px uppercase | Semibold |

### From Raycast — Structure and Components

- **3-zone nav:** Logo | links (Product / Industries / Pricing / Demo) | [Sign In ghost + "Book a Demo" green CTA]
- Transparent nav → frosted blur on scroll
- **Two max-widths:** `680px` for copy blocks, `1180px` for product visuals — never mixed
- Centered headline → full-width visual per section (lead with copy, reveal visual below)
- Alternating zigzag 2-column for feature rows
- Label pill badges above H2s ("Booking" / "Operations" / "Analytics")
- No divider lines — vertical padding + subtle background alternation (`#FAFAF9` ↔ `#FFFFFF`) only
- Bottom CTA mirrors hero exactly
- 40/60 card proportion: 40% metadata, 60% product screenshot

### From Resend — Spacing and Micro-Details

- 4px base grid, ~96px section top/bottom padding
- 32–48px gap between body copy and CTA
- **Contrasting button radii:** `8px` primary / `16px` secondary
- "● All systems operational" in footer
- Framing line above social proof: *"Trusted by service businesses that can't afford mistakes."*
- No public pricing → "Custom quote" section

### The Signature Element

**The live booking UI as the hero anchor.** The actual 6-step booking flow (branch → service → time → details → confirm → booking number), shown full-width below the hero CTAs. No device mockup, no illustration. Real product, at scale.

### Deliberately NOT Doing

- No dark theme
- No purple, blue, or teal
- No gradient hero, blob shapes, or particle effects
- No device mockup frames around product screenshots
- No "simplest booking app" or Calendly-lightweight positioning
- No generic calendar iconography
- No pure `#000000` text anywhere

---

## 3. Section Order (13 sections, locked)

| # | Section | Notes |
|---|---------|-------|
| 1 | **Nav** | "Zenly" text wordmark \| Product / Industries / Pricing / Demo \| Sign In + "Book a Demo" |
| 2 | **Hero** | Left-aligned H1 (Playfair Display) + sub + dual CTAs + meta text + full-width booking UI screenshot |
| 3 | **Trust band** | "Trusted by service businesses that can't afford mistakes." + Nuad Thai callout |
| 4 | **3-Pillar value prop** | Booking / Operations / Financial Clarity — 3-column cards |
| 5 | **Feature 1 — Booking** | Label badge → H2 → full-width booking flow screenshot |
| 6 | **Feature 2 — Operations** | Zigzag: staff dashboard left/text right → text left/reconciliation UI right |
| 7 | **Feature 3 — Scale** | Industry verticals: 3 featured (Spa / Salon / Dental) + 5 overflow row |
| 8 | **Stats band** | 4 numbers: 3,200+ bookings / 194 services / 39 therapists / 30-sec close |
| 9 | **Social proof** | Anish M. testimonial + Nuad Thai specifics |
| 10 | **Pricing** | "Pricing that fits your business" + custom quote CTA — no public tiers |
| 11 | **FAQ** | Accordion, 8–10 questions |
| 12 | **Bottom CTA** | Mirrors hero: same headline structure, same two CTAs |
| 13 | **Footer** | 5 columns + "● All systems operational" + contact info |

---

## 4. Hero Headline (Approved)

**Headline:**
> "Your customers book online. Your team runs smarter."

**Why it won:** Only option that addresses both audiences (customers + staff) simultaneously — which is Zenly's actual differentiator over Calendly/lightweight tools.

**Subheadline:**
> "Online booking, staff dashboards, and daily revenue reconciliation — in one platform built for any appointment-based business."

**CTAs:**
- Primary: "Book a Demo" → contact/quote form
- Secondary: "See It Live" → `https://zenly.zunkireelabs.com`
- Meta text: "No credit card required · Setup in minutes · Works for any service business"

**Hero layout:** Sierra-style left-aligned — targets the buyer (business owner). Asymmetric: copy left, full-width booking UI below/right.

---

## 5. Content Spec

### Value Prop Framing
> "Zenly isn't a booking widget. It's the complete operating system for your service business — from the first customer booking to the daily revenue close."

### Social Proof (Placeholder — swap before launch)

**Testimonial:**
> "We had 39 therapists and 12 rooms to coordinate every day. Scheduling conflicts, payment gaps, and end-of-day reconciliation were constant headaches. Zenly replaced all of it. The daily close alone saves me over an hour every single night."
>
> — Anish M., Operations Manager, Nuad Thai Spa

**Stats band:**

| Stat | Label |
|------|-------|
| 3,200+ | Bookings managed |
| 194 | Services, zero scheduling conflicts |
| 39 | Therapists, one dashboard |
| 30 sec | Average daily close time |

### Pricing Section
- H2: "Pricing that fits your business"
- Sub: "Every business runs differently. We'll build a plan around your team size, branch count, and volume."
- Primary CTA: "Get a Custom Quote"
- Secondary CTA: "See It Live"

### Vertical Section
- **3 featured cards:** Spa & Wellness / Hair Salon / Dental Clinic
- **Overflow row:** "Also works for →" Tattoo Studio · Physiotherapy · Personal Training · Cleaning Service · Nail Studio

---

## 6. Resolved Decisions

| Question | Decision |
|----------|----------|
| Pricing model | No public pricing — "Custom quote" section |
| Primary CTA | "Book a Demo" → contact/quote form |
| Geographic positioning | Global — no geographic framing |
| Brand name | Just "Zenly" — name stands alone |
| Vertical focus | Lead with Spa / Salon / Dental + 5 overflow |
| Social proof | Crafted Nuad Thai placeholder — swap before launch |
| Logo | Text wordmark "Zenly" — no image asset |
| Live demo URL | `https://zenly.zunkireelabs.com` |

---

## 7. Conflict Resolutions

| Conflict | Resolution |
|----------|-----------|
| Button radius: brand 8px vs Resend 4px | Use 8px primary / 16px secondary — keeps warmth, maintains hierarchy contrast |
| Gold accent risk in SaaS context | Micro-accent only — never a button or background |
| Raycast centered hero vs Sierra left-aligned | Sierra left-aligned adopted — targets buyer, not split audience |
| Earth brown competes with green + gold | Brown demoted to footer/labels only — green is the dominant CTA color |

---

## 8. Reference Files

| File | Purpose |
|------|---------|
| `docs/CONTEXT.md` | Full product context, audience, features, brand colors |
| `INSPO_01_fresha.md` | Content audit — Fresha (consumer marketplace) |
| `INSPO_02_treatwell.md` | Content audit — Treatwell (consumer marketplace) |
| `INSPO_04_square.md` | Content audit — Square Appointments (feature + pricing reference) |
| `INSPO_05_trafft.md` | Content audit — Trafft (positioning + copy reference) |
| `DESIGN_01_sierra.md` | Design audit — Sierra (color, typography, theme) |
| `DESIGN_02_raycast.md` | Design audit — Raycast (components, layout, structure) |
| `DESIGN_03_resend.md` | Design audit — Resend (pricing layout, spacing, micro-details) |
