# Keyword Map — Zennly (Nepal-first, then global)

Built from the existing site content (`solutions.json`, `features.json`, `docs/CONTEXT.md`, `docs/COPY.md`, the 3 blog posts) rather than generic global SaaS research.

**The actual goal (corrected framing, 2026-09-28): visibility to any potential tenant, not competitor-beating.** Zennly can onboard any appointment-based service business — spa, salon, gym, tattoo studio, physiotherapy clinic, cleaning company — as a tenant. The point of this keyword work is that ANY owner of one of these business types who searches for booking/scheduling/management software in Nepal should be able to find Zennly, regardless of what else is also in the results. The "gap vs. contested" labels below are still useful — they tell you where content/FAQ investment goes furthest — but they are not a "which competitor do we beat" exercise. Even in a contested vertical (gym), the job is still just "show up," not "win against FitFlow specifically."

Legend: **Gap** = low/no competitor coverage in Nepal, high priority for H1/title/FAQ placement — cheapest visibility. **Contested** = other software already ranks here too, so visibility takes more content, but Zennly should still be findable, not conceding the vertical.

## Update — live web search check (2026-09-28)

The gap/contested labels below were originally reasoning-based, not checked against real search results (no GSC access yet for this site). A round of live web searches corrected several of them — this is real competitive evidence, not inference:

**Real Nepal competitors found (previously unknown to this plan):**
- **Spa/salon**: M AND R Solution (mrsolution.com.np), Delta Tech Nepal (deltatechnepal.com), Joomni Solutions (joomni.com), Tab Space Pvt. Ltd. (tsnepal.com) — all offer appointment booking + staff/therapist scheduling + membership plans for Nepal salons/spas. Also listed on directories: Yellow Pages Nepal, Inquiry Nepal.
- **Gym/fitness**: heavily contested — at least 7 dedicated Nepal gym-software products exist (FitFlow, MeroGym, GymNepal Pro, Gym Saathi, GymUdaan, NepGym, Delta Tech Gym), several with 100–450+ active gyms already using them.
- **Physiotherapy**: no Nepal-specific competitor found — closest are India-based (PhysioSoftware, PhysioCare PMS). This vertical is confirmed still a genuine gap for Nepal specifically.
- **Cleaning**: no dedicated Nepal cleaning-*scheduling-software* competitor found. The Nepal results that did appear (Sajilo Sewa, SeWahh, Nepal Cleaning Solution) are cleaning *service companies*, not software vendors — meaning they're plausible sales leads/case-study prospects for Zennly, not competitors.
- **Multi-branch/staff-transfer/discount-audit-trail** (the product's core differentiators): dominated globally by Phorest, Pabau, Zenoti, Meevo, Vagaro, Salonist — but none of them specifically target Nepal. The bare/global form of these terms ("multi-branch spa management software") is highly contested by these international players; the Nepal-suffixed form remains comparatively open.

**Label corrections from this round:**
- `/solutions/spa/`, `/solutions/salon/`: downgrade from pure **Gap** to **Contested-but-winnable** — real local competitors exist and already rank, but none of their marketing (per the search snippets) mentions multi-branch staff transfer, discount-approval audit trails, or daily reconciliation — Zennly's actual differentiators are still uncontested *within* this now-contested space. Keep leading with those specific features in copy/FAQ, not generic "spa booking software" framing.
- `/solutions/fitness/`: downgrade to **Contested** (not "Contested but Nepal-specific keeps it gap-like" as originally written) — this is the single most crowded vertical in Nepal for this product category. Deprioritize fitness content investment relative to physiotherapy/cleaning unless there's a specific reason to compete here.
- `/solutions/physiotherapy/`, `/solutions/cleaning/`: confirmed **Gap**, now with real evidence behind the label, not just inference.

**Product roadmap item — NOT supported today (confirmed 2026-09-30):** every Nepal gym-software competitor found prominently advertises **Khalti and eSewa** integration (Nepal's two dominant digital payment gateways). Zennly has neither, and no Open API. **Do not publish any copy, FAQ, schema, `llms.txt` line or directory listing that claims Khalti/eSewa support or an API** until it ships — search and answer engines repeat page claims, so an unsupported claim becomes a false answer. Once integrated, add "Khalti"/"eSewa" keywords to `/features/payment-tracking/` and the homepage.

**Off-page opportunity (feeds Phase 5):** Yellow Pages Nepal and Inquiry Nepal are real, currently-ranking Nepali business directories that already list Zennly's competitors — worth adding Zennly to both as directory listings/backlinks.

## Core / brand

| Route | Primary keyword | Secondary keywords | Label | AEO question form |
|---|---|---|---|---|
| `/` | booking and operations platform for service businesses Nepal | multi-branch scheduling software Nepal, appointment booking system Nepal, **booking software Nepal**, **scheduling app Nepal**, **online booking system Nepal** | Gap | "What software do Nepali spas and salons use to manage bookings across branches?" |
| `/pricing/` | Zennly pricing | custom quote booking software, no fixed pricing scheduling software, **booking software price Nepal**, **scheduling software cost Nepal** | Gap | "How much does multi-branch booking software cost in Nepal?" |
| `/how-it-works/` | how Zennly works | multi-branch booking setup, service business onboarding software, **how to set up online booking for my business** | Gap | "How do you set up booking software for a multi-branch service business?" |
| `/case-study/` | multi-branch spa booking software case study Nepal | spa booking case study Nepal, multi-branch spa management Nepal | Gap | "How does a 4-branch spa in Kathmandu manage bookings and staff?" |

## Wellness / spa cluster (priority — real live client, most-developed content)

| Route | Primary keyword | Secondary keywords | Label | AEO question form |
|---|---|---|---|---|
| `/solutions/spa/` | spa booking software Nepal | wellness center scheduling software Nepal, wellness appointment software, massage therapy booking software, multi-branch spa management software, **spa booking software** *(no-country form — see note below)*, **spa booking app**, **spa appointment app**, **spa management software Nepal**, **wellness booking app Nepal**, **spa scheduling app Kathmandu**, **spa membership management software**, **spa gift voucher booking system**, **spa package booking software Nepal** | Gap | "What booking software is built for spas and wellness centers in Nepal?" |
| `/solutions/salon/` | salon booking software Nepal | hair salon scheduling app, nail salon appointment software, salon staff scheduling Nepal, **salon booking software**, **salon booking app**, **salon appointment app Nepal**, **beauty parlour booking software Nepal**, **salon management software Kathmandu** | Gap | "What scheduling software handles stylist bookings across multiple salon branches?" |

**Note on "no-country" variants:** many real searches — especially from people already in Nepal — drop the country name entirely (Google infers location from the searcher, so "spa booking software" typed from Kathmandu already returns Nepal-biased results). These shorter forms are now included as secondary keywords everywhere below, not just spa/salon, so the site isn't only optimized for the Nepal-suffixed phrasing. They also double as the on-ramp for the later global-expansion phase, since they carry no Nepal lock-in.

**Local colloquial term worth testing:** "beauty parlour" (not "salon") is the more common phrase in Nepali/Indian-subcontinent English for this business type — added above as a secondary keyword on `/solutions/salon/` since it's a real, likely-uncontested local variant that formal SaaS copy typically misses entirely.

## Other verticals

| Route | Primary keyword | Secondary keywords | Label | AEO question form |
|---|---|---|---|---|
| `/solutions/tattoo/` | tattoo studio booking software Nepal | tattoo artist scheduling app, tattoo consultation deposit booking, **tattoo shop booking software**, **tattoo appointment app Nepal** | Gap | "How do tattoo studios manage artist schedules and deposits?" |
| `/solutions/fitness/` | gym booking software Nepal | personal trainer scheduling app, fitness class booking system, membership package tracking software, **gym management software Nepal**, **gym booking app**, **fitness studio software Nepal**, **personal trainer app Nepal** | Contested (global fitness-app market is crowded; Nepal-specific angle keeps it gap-like) | "What software tracks gym classes, trainers, and membership packages together?" |
| `/solutions/physiotherapy/` | physiotherapy clinic scheduling software Nepal | physiotherapy appointment software, treatment course tracking software, **physiotherapy clinic software**, **physio appointment app Nepal**, **clinic scheduling software Nepal** | Gap | "How do physiotherapy clinics keep a treatment course on schedule with the same therapist?" |
| `/solutions/cleaning/` | cleaning service scheduling software Nepal | cleaning staff dispatch software, on-site job tracking app, **cleaning company software Nepal**, **housekeeping scheduling app**, **cleaning service booking software** | Gap | "What software dispatches cleaning staff to the right site on time?" |

## Feature pages (functional differentiators — the product's actual gap keywords)

| Route | Primary keyword | Secondary keywords | Label | AEO question form |
|---|---|---|---|---|
| `/features/booking/` | multi-branch booking management software | appointment lifecycle tracking software, conflict-free scheduling software, **online appointment booking system Nepal**, **prevent double booking software** | Gap | "How do you prevent double-bookings across multiple branches?" |
| `/features/operational-visibility/` | real-time multi-branch operations dashboard | branch visibility software for service businesses, **multi-branch business dashboard Nepal** | Gap | "How can an owner see all branches' bookings in one place?" |
| `/features/payment-tracking/` | payment tracking software for service businesses | daily revenue reconciliation software, cash card online payment tracking, **daily cash reconciliation software Nepal**, **salon/spa payment tracking app** | Gap | "How do service businesses reconcile cash, card, and online payments daily?" |
| `/features/reports/` | business reports software for service businesses | revenue and staff performance reporting software, **daily business report software Nepal** | Contested (generic "reporting software" is broad) — Nepal + vertical framing keeps it gap-like | "What reports should a multi-branch service business check daily?" |
| `/features/staff-management/` | staff scheduling and transfer software | multi-branch staff management software, **staff scheduling app Nepal**, **employee shift management software Nepal** | Gap | "How do you schedule a staff transfer between branches?" |
| `/features/discount-management/` | discount tracking software for service businesses | discount leakage prevention software, staff discount approval workflow, **staff discount approval app**, **discount audit trail software** | Gap (matches existing blog post "discount-leakage") | "How do you stop staff from giving unauthorized discounts?" |
| `/features/role-based-access/` | role-based access control for service businesses | staff permission software, owner manager frontdesk access levels, **staff access control software Nepal** | Gap | "What access should managers vs. front-desk staff have in booking software?" |

## Future feature — AI call/chat handling (in development, NOT live — do not publish yet)

Confirmed with the team (2026-09-28) this is currently in development. **No page, FAQ, or metaDescription should claim this exists until it actually ships** — publishing it now would misrepresent the product. Recording the keyword opportunity here so it's ready the moment it's real:

- Candidate keywords once live: "AI receptionist for bookings Nepal," "AI phone booking assistant," "automated appointment calls software," "AI chatbot for salon bookings," "24/7 booking assistant Nepal." Likely a strong Gap cluster — none of the Nepal competitors found in the live search check (M AND R Solution, Delta Tech Nepal, FitFlow, MeroGym, etc.) mention AI call/chat handling at all.
- When it ships: add a `/features/ai-assistant/` (or similar) entry to `features.json` following the existing schema (hero, metaDescription, objections.items for FAQ), and it will automatically pick up JSON-LD FAQ/breadcrumb schema via the existing shared template — no new plumbing needed, just content.

## Added 2026-10-07 (FAQ, compare, city layer, new industries, new features)

| Route | Primary keyword | Secondary keywords | AEO question form |
|---|---|---|---|
| `/faq/` | booking software Nepal FAQ | what is Zennly, multi-branch booking software, scheduling app Nepal, online booking system Nepal | "What booking software can I use for my business in Nepal?" |
| `/compare/` | booking software vs spreadsheets | WhatsApp vs booking software, spreadsheet scheduling problems, paper register vs software | "Is booking software better than a spreadsheet for a spa or salon in Nepal?" |
| `/nepal/` and `/nepal/{city}/` | booking software {city} Nepal | spa booking software {city}, salon software {city}, online booking {city} | "What booking software can I use for my business in {city}?" |
| `/solutions/barbershop/` | barbershop booking software Nepal | barber shop appointment app, barber scheduling software, walk-in and appointment barbershop software | "What booking software works for a barbershop in Nepal?" |
| `/solutions/beauty-clinic/` | beauty clinic booking software Nepal | aesthetic clinic scheduling software, skin clinic appointment software, practitioner and room booking | "What software helps manage a beauty clinic in Nepal?" |
| `/solutions/bridal-makeup/` | bridal makeup studio booking software Nepal | makeup artist booking app, bridal booking software, makeup studio scheduling | "What booking software suits a bridal makeup studio in Nepal?" |
| `/features/memberships/` | membership management software Nepal | prepaid membership software, spa membership software, wallet balance membership | "How do I run prepaid memberships for a spa or gym?" |
| `/features/packages/` | spa package management software Nepal | session package software, treatment package tracking, package redemption software | "How do I track session packages and redemptions?" |
| `/features/vouchers/` | gift voucher software Nepal | spa gift voucher system, prepaid voucher tracking, voucher balance software | "How do I manage gift vouchers for a spa or salon?" |
| `/features/campaigns/` | spa and salon promotions software Nepal | discount campaign scheduling, promotion banner online booking, seasonal offer software | "How do I run a promotion that shows in online booking?" |
| `/features/outreach/` | customer outreach software Nepal | win-back email for salons, review request automation, lapsed customer emails | "How do I win back customers who stopped visiting?" |
| `/features/payroll/` | spa and salon payroll software Nepal | therapist commission calculation, attendance deduction payroll, branch payroll software | "How do I calculate therapist commission and payroll per branch?" |

Brand rule still applies: no Nuad Thai brand keywords; Nuad Thai is named only as proof.

## Built but not yet on stage/main — do NOT publish until live (noted 2026-10-07)

Confirmed by the team: these are part of the product plan but are not on the stage/main branch yet. Pages must not claim them until they ship, same rule as AI call/chat handling above.

| Feature | Page to update when live | What to add |
|---|---|---|
| Outreach via SMS and WhatsApp (email only today) | `/features/outreach/` (`features.json`, slug `outreach`) | Replace the "Email is live today. SMS and WhatsApp are not available yet." FAQ answer; add channels to the hero/primary features |
| Birthday, renewal-reminder and rebooking messages | `/features/outreach/` | Add as primary features and in the how-it-works steps |
| Membership tier discount rules applied automatically | `/features/memberships/` | Add a primary feature and an FAQ; today staff enter discounts per booking |
| Payroll Excel export | `/features/payroll/` | Add a primary feature once the export is confirmed live |

When any of these ships: edit the entry in `src/_data/features.json`, add the new keywords here, bump `dateModified`, and update `llms.txt`/`llms-full.txt` if the one-line description changes.

## Blog (existing pain-point content — keywords already implicit, now formalized)

| Route | Primary keyword | AEO question form |
|---|---|---|
| `/blog/daily-reconciliation/` | daily revenue reconciliation for service businesses | "What should daily revenue reconciliation actually take?" |
| `/blog/discount-leakage/` | discount leakage service business | "What is discount leakage and how do you stop it?" |
| `/blog/spreadsheets-stop-working/` | when do spreadsheets stop working for scheduling | "Why do spreadsheets break down after a second branch?" |

## How this feeds the rest of the site

- `metaDescription` fields already shipped in `solutions.json`/`features.json` (Phase 1) were written from this map's primary/secondary keywords.
- The AEO question forms above are the template for new FAQ entries — current `faq`/`objections` arrays are objection-handling copy, not yet phrased as real search queries. Recommended next content step: add 1–2 FAQ entries per solution/feature page using the literal AEO question form above (e.g. add "What booking software is built for spas and wellness centers in Nepal?" as an actual FAQ question on `/solutions/spa/`), so the FAQPage schema (Phase 2) surfaces the exact phrasing answer engines match against.
- Nepal modifiers are applied broadly (not just the case-study page) per the market-capture priority — every solution/feature primary keyword includes "Nepal" or is written so a Nepal-market answer engine query matches it.

## Rule: never compete with the client on their own brand (2026-09-30)

Nuad Thai's own site owns searches for "Nuad Thai Spa" and will always rank first for them. Zennly pages must not target Nuad Thai brand keywords. The case study leads with Zennly and the generic keyword "multi-branch spa booking software Nepal"; Nuad Thai is named in the page body as proof, and in schema only as a `mentions` reference (no address or phone, so Google does not read our page as their business listing). Zennly should outrank Nuad Thai only for generic booking-software searches.
