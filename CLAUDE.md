# Design Rules

This website is already designed.

Never redesign it.

Every new page must extend the existing design system.

Always:
- Reuse existing components
- Match spacing exactly
- Match typography
- Match animations
- Match colors
- Match visual density
- Match section transitions

Avoid:
- Generic SaaS templates
- New card styles
- New button styles
- Different border radius
- Different spacing systems

Every page should feel indistinguishable from the homepage.

# Exception: Individual Solution Pages (/solutions/{slug}/)

Approved 2026-09-15. The `/solutions/{slug}/` page family (spa, salon, tattoo, …) is
intentionally exempt from the "never redesign" rule above.

These pages use a distinct, new visual system, designed to closely replicate the
structural/visual language of Calendly (composition, gradients, rounded hero
container, stats section, how-it-works, final CTA) and Acuity Scheduling
(alternating image/text feature showcase, testimonials, dark FAQ accordion) —
using Zennly's own content, product data, and brand fonts/colors, not their
content or branding.

This exception is scoped to this one page family only. It does not extend to any
other page — every other page on the site still follows the base Design Rules
above without exception.

# Exception: About Page Dark Top (/about/)

Approved 2026-10-22. The first section of `/about/` is a dark (#1C1C1C, the button
colour) block modelled on the structure of Square's About page (squareup.com/us/en/about):
a rounded-square video sized to fit the first screen with the headline overlaid, a
centred statement, a two-column "About Zennly", a stats row and three white link cards.
It uses Zennly's own video, content, fonts and colours, not Square's footage or branding.

Scoped to that one section of `/about/` only. The rest of the About page, and every
other page, still follows the base Design Rules above.

# Exception: Solutions Index Hero (/solutions/)

Approved 2026-10-23. The top of `/solutions/` is modelled on the structure of Square's homepage
(squareup.com/us/en): a full-bleed video hero under a transparent white-text nav, pinned while the
video shrinks into a centre tile and a collage of photos, product tiles and hand-drawn doodles fades in
around it, ending on one line. It is followed by a dark (#1C1C1C, the button colour) industry band using
the homepage's photo-card style. It uses Zennly's own video, photos, original doodles, fonts and colours,
not Square's footage, artwork or branding.

Scoped to those two sections of `/solutions/` only (classes `si-*`, body class `si-nav-clear`). The rest
of the page uses the shared fd-page system, and every other page still follows the base Design Rules above.

# Exception: Features Index Showcase (/features/)

Approved 2026-10-26. The `.feat-idx-*` feature-grid section of `/features/` is modelled on the
structure of a generic SaaS "Finlytix"-style features page: a quick-nav pill bar followed by an
alternating left/right image-and-text showcase (one row per feature, image on a soft tinted card
alternating sides, heading + copy + checklist + a pill CTA on the other side). It uses Zennly's own
product screenshots, copy, icons and per-feature accent colors — carried over unchanged from the
previous card-grid layout — not the reference template's content, imagery or button styling.

Also covers the `/features/` hero (`.feat-page-hero*`), extended the same day to match the same
Finlytix reference's hero composition: a rating/eyebrow pill row, a bold two-line headline, a single
pill CTA, and a browser-chrome-framed product panel on the right with floating stat/status cards. It
uses Zennly's own dashboard screenshot (not a stock photo) inside the panel, the homepage's own
green-mesh gradient (the `.v2-practice` recipe from `src/index.njk`) as the panel background instead
of the reference's colors, and the site's existing dark CTA pill instead of the reference's
multicolor gradient button.

Scoped to those two sections of `/features/` only (classes `feat-idx-pillnav`, `feat-idx-zigzag`,
`feat-idx-row*`, `feat-page-hero*`). The rest of `/features/` (pillars, transformation diagram,
proof stats, social proof, FAQ, bottom CTA, footer), and every other page, still follows the base
Design Rules above.

# Exception: Blog Article "Keep Reading" Section (/blog/{slug}/)

Approved 2026-10-26. The "Keep reading" section at the bottom of individual `/blog/{slug}/`
article pages is modelled on the structure of Owner.com's blog category module: a cream
section background, a left-hand column with a heading, one line of supporting copy and a pill
"View all" button, and a right-hand asymmetric grid — one large featured card plus two smaller
stacked cards, each with a category eyebrow, title and a read-time/date row. It uses Zennly's
own post images, copy and categories, and only existing design tokens (`--color-surface-alt`
cream, `--color-primary` green, `--color-surface` white cards, `--radius-lg`/`--radius-pill`) —
not Owner.com's colors, fonts or button styling.

Scoped to this one section only (classes `blog-kr-*`), on blog article pages only. It replaces
the previous `.article-more`/`.blog-idx-rows` treatment on pages that adopt it. Every other
section of blog pages, and every other page on the site, still follows the base Design Rules
above.

# Exception: Features Platform Argument (/features/)

Approved 2026-10-26. The "These aren't six features..." section of `/features/` (previously a
plain three-column `.pillars` text list) is modelled on a generic SaaS "advanced features" grid:
an eyebrow pill and heading on the left with one line of supporting copy on the right, followed
by a three-column row where each column is a standalone rounded gradient-tile image (icon
centred on a colour tile) with an icon/title/description block sitting detached below it on the
page background — not boxed together as one card. It uses Zennly's own copy and the existing
icon set from the previous `.pillars` version, and the sage/gold/lilac gradient tints already
used by `.feat-tile` elsewhere on the page — not the reference's stock photography.

Scoped to this one section only (classes `feat-plat-*`), on `/features/`. Every other section of
`/features/` not already covered by the Features Index Showcase exception above (transformation
diagram, proof stats, social proof, FAQ, bottom CTA, footer), and every other page, still follows
the base Design Rules above.

# Exception: Features Numbers & Testimonial Band (/features/)

Approved 2026-10-26. The previously separate "What a week on the platform looks like" stats
section and "From the people running this every day" testimonial grid on `/features/` are merged
into one section, modelled on a generic SaaS "stats + testimonial" band: a bordered eyebrow pill,
centred heading and sub-copy, a row of tinted stat cards, a divider, then a single centred
testimonial with avatar, name/role and business. It uses Zennly's own copy — all six existing
stats, unchanged, plus the strongest of the three existing testimonials (the multi-branch spa
owner quote; the other two were dropped since the reference carries only one) — and reuses the
existing `.section__badge`/`.feat-idx-eyebrow` pill plus the site's own sage/ink tokens, not the
reference's colors or card style.

Scoped to this one section only (classes `feat-ns-*`), on `/features/`. It replaces the
`.fd-proof`/`.fd-social` markup on this page only — those classes, and their styling, are
unchanged and still used as-is on the individual `/features/{slug}/` detail pages. Every other
section of `/features/`, and every other page, still follows the base Design Rules above.

# Exception: Features Final CTA Collage (/features/)

Approved 2026-10-26. The final CTA band on `/features/` (previously the shared dark
`page--pink-cta` banner used across most of the site) is replaced on this page only with a
photo collage around a centered headline and pill button, modelled on a generic SaaS final-CTA
layout: a soft sage-tinted gradient background, six photo cards scattered around the edges, a
centered heading and one pill CTA with a trailing circular arrow. It uses six of Zennly's own
solution photos already shipped on `/solutions/{slug}/` (salon, barbershop, fitness, spa, tattoo,
bridal-makeup) — not new stock photography — the same sage/gold gradient recipe already used on
this page's hero panel (`.feat-page-hero__panel`), and the existing `.feat-page-hero__cta` pill
button component, not the reference's colors or button style.

Scoped to this one section only (classes `feat-fcta-*`), on `/features/`. It replaces the shared
`.bottom-cta`/`page--pink-cta` band on this page only — that component is unchanged and still used
as-is on every other page that has it. Every other section of `/features/`, and every other page,
still follows the base Design Rules above.
