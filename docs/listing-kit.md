# Third-Party Listing Kit — Zennly

Copy-paste material for directory / review-site / profile listings. Written 2026-09-30.
Purpose: backlinks + citations + brand mentions that help Zennly rank in Nepal and get quoted by AI answer engines.

## Golden rules (read before submitting anything)

1. **Same details everywhere (NAP consistency).** Use the exact name, URL and contact below on every listing. Do not vary them.
2. **Only claim what exists today.** Do NOT claim: Khalti/eSewa integration, an Open API, AI call/chat handling, any integration list, a free plan, or fixed pricing. See `docs/keyword-map.md`. If a form asks "Open API?" answer **No** (matches the site).
3. **Never use Nuad Thai's phone number or address** as Zennly's. They are a client, not the company.
4. **Link only to `https://zennly.io`** (never `zenly.zunkireelabs.com`, never the staging host).
5. Keep a log of every listing (site, date, URL of the live listing, login) in the table at the bottom.

## Core facts

| Field | Value |
|---|---|
| Product name | Zennly |
| Website | https://zennly.io |
| Demo / contact link | https://zennly.io/demo/ |
| Contact email | info@zennly.io |
| Company | Zennly — a product made by Zunkireelabs (https://zunkireelabs.com) |
| Launched | 2026 |
| Country / market | Nepal |
| Category | Appointment scheduling; Business management software; Salon & spa software; Gym / fitness software |
| Pricing | Not published yet — leave pricing blank / "contact for quote" on listings |
| Platform | Web (browser-based) |
| Open API | No |
| Customers | Nuad Thai Spa Kathmandu — 4 branches, 39 therapists, 12 rooms, 194 services (live client; get their OK before naming them on third-party sites) |
| Logo | `src/assets/images/logo.png` (brand is a wordmark; favicon at `src/assets/images/favicon.svg`) |
| Screenshot | `src/assets/images/og-default.jpg` (1200x630 dashboard) and `src/assets/images/dashboard-mockup.png` |
| Social profile already known | https://share.google/OMw78VXlwqW4GTaON (Google listing, in site schema `sameAs`) |

## Copy blocks

**Tagline (under 60 chars):**
Booking & operations software for service businesses in Nepal

**Short description (under 160 chars):**
Multi-branch booking and operations software for spas, salons, gyms and clinics in Nepal — online booking, staff scheduling, payments and daily reconciliation.

**Medium description (about 300 chars):**
Zennly is a multi-branch booking and operations platform for appointment-based businesses in Nepal — spas, salons, tattoo studios, gyms, physiotherapy clinics and cleaning services. It replaces phone calls and spreadsheets with online booking, staff and room scheduling, discount approvals with an audit trail, and daily payment reconciliation across every branch.

**Long description (about 900 chars):**
Zennly is booking and operations software built for appointment-based service businesses in Nepal. Instead of a generic calendar, it handles the operational reality of a team: a therapist, stylist, artist or trainer, the room, and the time are booked together, and clashes are refused at database level, so double-bookings cannot happen — even across branches.

Owners get one view of every branch: bookings, staff, and revenue. Staff can be scheduled to transfer between branches. Discounts are requested by staff and approved by a manager, with a full audit trail. Payments are recorded at the point of service by method (cash, card, online), including part-payments, and the day is closed with a daily reconciliation. Role-based access gives owners, managers and front desk the right level of control, and built-in reports cover revenue, staff performance, discounts, attendance and referrals.

Zennly runs live at Nuad Thai Spa Kathmandu across four branches. Pricing is a custom quote based on branches, team size and features.

**Key features (bullets):**
- Online booking with conflict-free scheduling across branches
- Staff, therapist and room scheduling; scheduled staff transfers between branches
- Discount requests with manager approval and audit trail
- Payment tracking by cash, card and online, including part-payments
- Daily revenue reconciliation and a locked daily close
- Role-based access for owners, managers and front desk
- Revenue, staff performance, discount, attendance and referral reports
- Multi-branch dashboard for owners

**Ideal for:** spas and wellness centres, hair and beauty salons (beauty parlours), tattoo studios, gyms and personal trainers, physiotherapy clinics, cleaning companies — single-branch or multi-branch.

## Keywords / tags to use (pick what each form allows)

Primary: booking software Nepal · appointment scheduling software Nepal · spa management software Nepal · salon booking software Nepal · gym management software Nepal · multi-branch booking software

Secondary: online booking system Nepal · scheduling app Nepal · beauty parlour booking software · spa booking software · salon management software Kathmandu · tattoo studio booking software · physiotherapy clinic scheduling software · cleaning service scheduling software · staff scheduling software · daily revenue reconciliation software · discount approval software · business management software for service businesses

## Where to list (in priority order)

Do the free ones first. Check each site's current rules; some review/marketplace sites require a real customer to leave a review.

| # | Site | Why | Notes |
|---|---|---|---|
| 1 | Google Business Profile | Local pack + brand panel | DONE — created (https://share.google/OMw78VXlwqW4GTaON) |
| 2 | Yellow Pages Nepal | Listed competitors already rank here | Free listing; use NAP above |
| 3 | Inquiry Nepal | Same | Free listing |
| 4 | LinkedIn Company page (Zennly as its own page; mention "a Zunkireelabs product") | Strong brand signal; quoted by AI engines | Add website + description; link from site later |
| 5 | Facebook Business page | Very common in Nepal; local trust | Same NAP |
| 6 | Capterra / GetApp / Software Advice | Software comparison buyers | Category: Appointment Scheduling, Salon/Spa software; answer "Open API?" = No |
| 7 | G2 | Review site AI engines cite | Needs reviews to matter |
| 8 | SourceForge, AlternativeTo, SaaSHub, Crunchbase | Free backlinks + entity signals | Alternatives: list as alternative to generic salon/spa booking tools |
| 9 | Product Hunt | Launch visibility | Do once the site is live |
| 10 | Nepal startup / business directories and IT-company lists | Local backlinks | Search for current ones; avoid paid link farms |
| 11 | Nuad Thai's own site and social | Highest-value single link | Ask them to link to https://zennly.io and mention "powered by Zennly" |
| 12 | Zunkireelabs site | Own link | Link to https://zennly.io from the Zunkireelabs site, and point the old zenly.zunkireelabs.com article to it |

After each listing goes live: add its URL to `sameAs` in `src/_data/site.js` (this makes the Organization schema list the profile, which helps Google connect them).

## Listing log

Backfilled 2026-11-04 from the `sameAs` array in `src/_data/site.js`, which is the actual record of
live profiles. This table was empty before, which made it look as though no listings had been done —
`docs/seo-geo-aeo-plan.md` said they were done and this file implied they were not. The plan doc was
right. Keep this table updated from now on; `sameAs` and this log must agree.

| Site | Submitted | Live URL | Notes |
|---|---|---|---|
| Google Business Profile | before 2026-09-30 | https://share.google/OMw78VXlwqW4GTaON | In `sameAs` |
| G2 | before 2026-10-07 | https://www.g2.com/products/zennly | In `sameAs`. No reviews yet |
| GoodFirms | before 2026-10-07 | https://www.goodfirms.co/software/zennly | In `sameAs`. **This is the page search and AI engines actually cite for Zennly** |
| Capterra | before 2026-10-07 | https://www.capterra.com/p/10263080/Zennly/ | In `sameAs`. Also live on capterra.in / .ca / .co.uk as id 1311954. No reviews |
| Software Advice (AU) | before 2026-10-07 | https://www.softwareadvice.com.au/software/764131/Zennly | In `sameAs` |
| GetApp (AU) | before 2026-10-07 | https://www.getapp.com.au/software/2367946/zennly | In `sameAs` |

Still not done from the priority list above: Yellow Pages Nepal (2), Inquiry Nepal (3), LinkedIn
company page (4), Facebook business page (5), SourceForge / AlternativeTo / SaaSHub / Crunchbase (8),
Product Hunt (9), Nepal directories (10), Nuad Thai's own site (11), Zunkireelabs site (12).

### Open item: verify the GoodFirms listing does not overclaim

Because zennly.io is not indexed, the GoodFirms listing is what gets quoted when an engine answers a
question about Zennly. That makes its accuracy matter more than the site's right now. A web-search
summary of that listing on 2026-11-04 described features including "online payments" and "AI
features". Those may conflict with the rules in `keyword-map.md`: Zennly records payments by method
against a booking but is not a payment processor and has no Khalti/eSewa integration, and SMS,
WhatsApp and the AI assistant are "available on request", not standard.

**Not verified** — goodfirms.co returns HTTP 403 to automated fetches, so the listing has to be
opened in a browser and read by hand. If it does overclaim, correct it there first: a wrong claim on
the page that engines cite becomes the answer people are given, regardless of what the site says.
