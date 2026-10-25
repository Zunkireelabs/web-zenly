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
