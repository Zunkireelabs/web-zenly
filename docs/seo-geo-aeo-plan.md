# SEO / GEO / AEO plan — own "booking software Nepal"

Written 2026-10-07. Goal: be the default answer for booking and operations software for service businesses in Nepal, in Google, AI Overviews and AI assistants.

## Where we stand
- Strong: entity layer (Organization schema, `sameAs`, disambiguation from zennly.org), `llms.txt`, glossary, 16 blog posts, case study, FAQ page, comparison page, 9 industry pages, 6 city pages.
- Weak: very new domain with no backlinks, thin feature coverage (8 pages vs ~30 for Chairlyo), no reviews, no public pricing, one proof point (Nuad Thai).
- GSC flat is expected for a 2026 domain. Impressions need indexing first, then authority.

## Phase 0 — Week 1: get indexed (cost: nothing)
1. Deploy this branch to production.
2. GSC: submit `sitemap.xml`; URL Inspection → Request indexing for `/`, `/faq/`, `/compare/`, `/nepal/`, `/pricing/`, `/case-study/`, top 5 blog posts, every `/solutions/*`.
3. Check GSC → Pages: any "Discovered, not indexed" or "Crawled, not indexed" URLs. Fix thin pages first.
4. Set up Bing Webmaster Tools (feeds ChatGPT search and Copilot) and submit the sitemap there too. Add IndexNow if hosting allows.
5. Confirm the live `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot.

## Phase 1 — Weeks 1–4: authority (the biggest lever for a new domain)
- Listings already done: G2, GoodFirms, Capterra, Software Advice, GetApp, Google Business Profile. Next: collect real reviews on each (aim for 5+ per site). Reviews are what AI assistants cite.
- Nepal citations: Nepal business directories, Nepal startup/tech lists, Kathmandu Post / Nepali tech blogs (guest post or product mention), LinkedIn company page, YouTube channel with a product demo, Facebook page.
- Nuad Thai: ask for a written, attributable testimonial and a link from their site to the case study.
- Press-style asset: publish the numbers we can prove ("4 branches, 39 therapists, 194 services on one system") and a short founder note. Journalists and AI both quote these.

## Phase 2 — Weeks 2–8: content coverage
Feature pages (one URL per real feature; add only features Zennly actually has):
- Live (written from the book-spa code, 2026-10-07): memberships, packages, vouchers, campaigns, outreach, payroll. Still to write: products/inventory, customers/CRM, public booking and customer accounts, referral rewards, notifications.
- Outreach is email only today; add SMS/WhatsApp claims only when they ship.
- Each page: one question as the H1 or H2, a 40–60 word direct answer, a short how-it-works, FAQ schema, links to the matching industry pages.

Comparison and decision content:
- "Best booking software in Nepal" buyer's guide (neutral, include how to evaluate; no unverified claims about named competitors).
- "Zennly vs [named competitor]" pages only with claims we can verify from their public pages, dated and sourced.
- Cost guide ("how much does booking software cost in Nepal") — already exists as a blog post; refresh it when pricing is decided.

Industry and city layer (started):
- Industries live: spa, salon, barbershop, beauty clinic, bridal and makeup, tattoo, fitness, physiotherapy, cleaning. Candidates next: yoga/pilates studios, dental/skin clinics, car wash, coaching/tuition.
- Cities live: Kathmandu, Lalitpur, Bhaktapur, Pokhara, Biratnagar, Chitwan. Do NOT mass-produce city x industry pages. Add a city x industry page only when there is something specific to say (a client, a local fact, a local guide).

Blog cadence: 2 posts per month, each answering one real question, each linking to one feature page and one industry page. Update `dateModified` honestly when content changes.

## Phase 3 — GEO / AEO (how AI assistants choose what to cite)
- Keep one-sentence entity definition identical everywhere: site, listings, LinkedIn, press. Consistency is what makes models repeat it.
- Every key page opens with a quotable 2-sentence answer (done on `/faq/`, city pages, compare page).
- Keep `llms.txt` and `llms-full.txt` current when pages are added (done for this batch).
- Add `SoftwareApplication` schema (name, category BusinessApplication, operatingSystem Web, areaServed Nepal) to the homepage once pricing is decided; do not add an `offers` price until it is public.
- Monthly AI visibility run: use the prompt set in `ai-visibility-log.md` across ChatGPT (search on), Perplexity, Gemini, Google AI Overviews, Claude. Log mentions and cited URLs. Add prompts: "booking software Pokhara", "Chairlyo alternative", "salon software Nepal price".
- Track AI referrers in analytics: chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com.

## Phase 4 — Technical hygiene (ongoing)
- Core Web Vitals on mobile (LCP image sizes on solution pages; the new pages reuse local PNG heroes).
- One canonical per page, correct `lastmod`, no orphan pages (every new page linked from nav, footer or a hub).
- Internal links: each blog post → feature + industry + FAQ; each city page → industries; each industry page → city hub.

## Metrics (review monthly, same day each month)
| Metric | Source | Target by month 3 |
|---|---|---|
| Indexed pages | GSC → Pages | all sitemap URLs |
| Impressions / clicks | GSC → Performance | non-zero and rising week over week |
| Queries containing "nepal" | GSC | 20+ distinct |
| Referring domains | Ahrefs / Bing WMT | 15+ |
| Reviews on listings | G2 / Capterra / GBP | 5+ each |
| AI prompts where Zennly is named | `ai-visibility-log.md` | 5 of 14 |

## Open decisions
- Public pricing (deferred) — unlocks cost-intent searches and SoftwareApplication offers.
- Which features to publish pages for (needs product confirmation).
- Real testimonials: several existing solution pages carry testimonial quotes with generic attributions. Replace with verifiable, named quotes or remove.

## Image credits (Pexels, free for commercial use, no attribution required)
- `solution-hero-barbershop.jpg` — Pexels photo 1813272
- `solution-hero-beauty-clinic.jpg` — Pexels photo 3738349
- `solution-hero-bridal-makeup.jpg` — Pexels photo 20593111
Source new images from Pexels from now on; download into `src/assets/images/` (don't hotlink) so the build converts them to WebP.
