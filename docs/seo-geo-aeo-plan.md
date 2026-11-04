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
- `feat-idx-ai-assistant.jpg` — Pexels photo 8204403
Source new images from Pexels from now on; download into `src/assets/images/` (don't hotlink) so the build converts them to WebP.

## Blog audit and cluster cleanup — 2026-11-04 (branch `blog`)

Audited all 57 posts. The technical and schema layer needed nothing: every post already carried
`h1`, an in-range `metaDescription`, publish/modified dates, a quotable `subtitle`, 2–7 FAQ entries,
related links and keep-reading cards, plus `Article` + `FAQPage` + `BreadcrumbList` schema. No broken
internal links anywhere on the site, and `blogPosts.json`, `blog.njk`, `llms.txt` and the sitemap were
all in sync.

What was actually wrong, and what was done:

1. **Keyword cannibalization in two clusters.** Four salon posts and three spa posts were chasing the
   same buying intent. One canonical post per cluster; the rest re-angled onto distinct intents
   (`salon-management-software` and `spa-management-software` became category explainers built around a
   working day; `beauty-parlour-software-nepal` became the parlour service-mix post;
   `wellness-center-booking-software-nepal` became the tourist/hotel-referral post).
   `how-to-choose-booking-software-nepal` is now the category hub and links down to every vertical
   guide. See the cluster table in `keyword-map.md`. No URLs changed, so no redirects.
2. **Thin internal linking.** 14 posts had fewer than two contextual inbound links from sibling posts,
   5 of them none at all — they were reachable only from the `/blog/` hub. Every post now has at
   least two contextual inbound links.
3. **Duplicate categories.** 19 category names for 57 posts, including `Salons`/`Salon & Spa`,
   `Gym & Fitness`/`Gyms & Fitness`, `Tattoo`/`Tattoo Studios` and `Finance`/`Money`. Merged to 16.
4. **Two new posts** on genuine gaps: the Dashain/Tihar festival rush, and opening a second branch in
   the Kathmandu valley.

### Known issues — all fixed 2026-11-04, see below

## Answers hub — 2026-11-04 (branch `blog`)

The site held 442 question/answer pairs scattered across 90 pages (86 feature, 86 solution, 232
blog, 30 city, 8 compare) with no single place where that corpus was browsable or citable. `/faq/`
exposed 14 of them.

`/answers/` now indexes all 442. Built from `src/_data/answers.js`, which reads `solutions.json`,
`features.json`, `compareVs.json`, `cities.json` and every blog post's front matter at build time —
so adding an FAQ entry anywhere on the site puts the question on the hub automatically, with nothing
to keep in sync by hand. Reuses the existing `pg-*` and `gl-*` components; no new CSS.

Two deliberate design decisions:

- **Questions only, no answer bodies.** The answers live on the pages that own them, with `FAQPage`
  schema. Reproducing 90KB of answer text on the hub would be on-site duplicate content competing
  with the pages that should rank. Each question is a link to its answer instead.
- **`CollectionPage` + a topic-level `ItemList`, not `FAQPage`.** A second `FAQPage` carrying the
  same 442 pairs would be duplicate structured data. An `ItemList` of all 442 questions was built
  first and dropped: it added 90KB of JSON-LD that search engines do not use for anything.

Linked from the global footer, `/faq/`, `llms.txt`, `llms-full.txt` and the sitemap. It links out to
all 90 answering pages, so it also works as a crawl hub spreading link equity off the home page.
231KB raw, 36KB gzipped — the same order as the existing `/blog/` index, and nginx has gzip on.

### Honest read on what is now the binding constraint

On-page question coverage is no longer the gap. The site answers 442 questions across 9 verticals,
14 features, 6 cities and 59 posts, every page carries answer-first copy and FAQ schema, `llms.txt`
is current and `robots.txt` welcomes every major AI crawler. Verified this pass: production
`robots.txt` allows all, no page carries `noindex`, and all internal links resolve.

What limits visibility is off-page, exactly as Phase 1 of this plan says:

1. **Indexing.** None of this ranks until it is crawled. GSC sitemap submission plus URL inspection
   on the new and re-angled pages, and Bing Webmaster Tools (which feeds ChatGPT search and Copilot).
2. **Referring domains.** Still the single biggest lever for a 2026 domain. Target 15+.
3. **Reviews on listings.** G2, Capterra, GetApp, Google Business Profile — 5+ each. Reviews are what
   AI assistants cite when asked for a recommendation.

Adding more pages before those three move will not produce more visibility. Writing more blog posts
is the cheapest thing to do here and the least likely to change the outcome.

### Considered and rejected this pass

- **`HowTo` schema** on the step-by-step posts. Google removed HowTo rich results from search in
  2023, so this is dead markup now — it would add weight and change nothing.
- **`speakable` schema.** Google's implementation is limited to news publishers.
- **`<meta name="keywords">`.** Ignored by every major search engine since the 2000s.

## Blog index maintenance fixes — 2026-11-04 (branch `blog`)

The three items left open by the audit above, all closed.

### 1. Dead category anchors now work

Every article breadcrumb links to `/blog/#<category>` (e.g. `/blog/#spa-wellness`), but the index
rendered no such anchors, so the jump did nothing. Rather than add category sections to the index —
a layout change the base Design Rules would not allow without a decision — the hash now drives the
**category filter the index already had**. On load (and on `hashchange`) the slug is matched back to
a category, the existing `<select id="blog2-cat">` is set to it, and the grid scrolls to the results.

No layout or visual change. Verified: all 16 distinct `categoryAnchor` values in the post files
resolve to a category option.

This also fixed a live bug it exposed: the category dropdown was a **hardcoded list** that had gone
stale. It still offered "Gyms & Fitness" (renamed to "Gym & Fitness" in the category merge, so the
filter matched nothing) and was missing "Growth" and "AI & Automation" entirely — those posts were
unreachable by filter. The list is now derived from the posts and sorted alphabetically, so a new or
renamed category can never go missing again.

### 2. Post metadata is no longer duplicated

Was in three places: `blog.njk` front matter (59 card entries), `src/_data/blogPosts.json`, and a
hardcoded 59-line list in `llms.njk`. Adding a post meant three edits.

Now one source. `src/_data/blogIndex.js` reads each post's own front matter and returns the index
list; `blog.njk`, the `Blog` JSON-LD, `llms.txt` and `llms-full.txt` all consume it. `blogPosts.json`
is deleted. Card fields that were already identical to post front matter are derived (`title` ← `h1`,
`tag` ← `category`, `read` ← `readTime`, `date` ← `datePublished`, `image` ← `coverImage`); the one
field that is genuinely card-specific moved into the posts as `cardExcerpt`, and `cardImage` is an
optional override where the index art differs from the hero art (currently one post,
`spreadsheets-stop-working`).

The only thing still stored separately is display **order**, in `src/_data/blogOrder.json`, because
order is an index-level decision, not a property of a post — 21 posts share a `datePublished`, so
sorting by date cannot reproduce a curated order. **Adding a post is now two edits: the post file,
and its slug in `blogOrder.json`.**

Drift is now a build failure rather than a silent bug. If a post file is missing from
`blogOrder.json`, listed there without a file, duplicated, or missing a required front-matter key,
the build stops with a message naming the slug. Tested by removing a slug: build fails as intended.

Three real inconsistencies surfaced and were corrected, the post being authoritative in each case
(the article page and its `Article` schema already showed the right value, only the index card was
wrong):

| Post | Index card said | Correct |
|---|---|---|
| `spreadsheets-stop-working` | July 10, 2026 | July 17, 2026 |
| `discount-leakage` | July 8, 2026 | July 17, 2026 |
| `daily-reconciliation` | July 5, 2026 | July 17, 2026 |
| `wellness-center-booking-software-nepal` | 5 min read | 6 min read |

### 3. BOMs stripped

Ten files, not the four first reported — the original check used a broken grep. `src/blog.njk`,
three blog posts, `src/case-study.njk`, `src/features.njk`, `src/solutions.njk`,
`src/_includes/base.njk`, `feature-detail.njk` and `solution-detail.njk`. No BOM remains in `src/`.

### Verification

Build output was diffed against a pre-change baseline. Of 113 pages, exactly three differ:
`blog/index.html` (the dropdown, the four corrections, the hash script), `llms.txt` and
`llms-full.txt` (same 59 blog URLs, titles now sourced from each post's `h1`). Every other page,
including all 59 post pages, is byte-identical. Sitewide: 112 pages, no invalid JSON-LD, all internal
links resolve, 57 cards + 2 featured on the index, 442 questions on `/answers/`.

## Indexing check — 2026-11-04, verified live

Prompted by a fair challenge: "haven't we already done the listings and indexing?" Checked rather
than assumed. The answer is different for each.

### Listings: done. Six profiles are live.

`src/_data/site.js` `sameAs` carries six real profile URLs — Google Business Profile, G2, GoodFirms,
Capterra, Software Advice AU, GetApp AU. The empty log table in `listing-kit.md` made it look
otherwise and has now been backfilled. They work: a `Zennly booking software Nepal spa salon` search
returns the GoodFirms and Capterra listings, with GoodFirms carrying the full positioning (Nepal,
Zunkireelabs, Lalitpur, Nuad Thai, 4 branches / 39 therapists / 194 services).

### Reviews: listings exist but are empty, and "5+ each" was never realistic.

The same search reported no independent reviews and zero users on the Capterra entry. With one live
client, 5+ reviews per site cannot happen. The honest ceiling today is one or two real, attributable
reviews from Nuad Thai's managers; after that it moves only when there are more clients. Treat the
Phase 1 "5+ per site" target as wrong and replace it with "every review you can legitimately get".

### Indexing: not done, and it is the whole problem.

`site:zennly.io` still returns nothing — same as the 2026-10 entry in `ai-visibility-log.md`. Every
search that surfaces Zennly cites a third-party listing, never zennly.io.

Nothing technical is blocking it. Verified against the live production site on 2026-11-04:

| Check | Result |
|---|---|
| `https://zennly.io/robots.txt` | 200. `User-agent: *` → `Allow: /`. No `Disallow`. All AI crawlers allowed. `Sitemap:` line present |
| `https://zennly.io/sitemap.xml` | 200, 107 URLs |
| `https://zennly.io/` | 200, no `<meta name="robots">`, canonical correct |

So the site is crawlable and has been. The remaining explanations need Google Search Console to tell
apart, and only the account holder can look:

1. The sitemap was never actually submitted in GSC or Bing Webmaster Tools.
2. It was submitted and a zero-authority 2026 domain simply has not been indexed yet.
3. GSC → Pages shows "Discovered — currently not indexed" or "Crawled — currently not indexed",
   which is Google declining, not failing. That is an authority problem, not a technical one.

**Until zennly.io is indexed, none of the on-page work can be cited** — not the 442 answers, the 59
posts, the schema or `llms.txt`. The listings are carrying the entity on their own. This is the one
task that gates everything else, and it cannot be done from the repo.

## Technical SEO / GEO audit — 2026-11-04 (branch `blog`)

Audited the built site rather than assuming. Most of the technical layer was already correct, so
this records what was checked and found clean as much as what was fixed — the clean list is what
stops the same ground being re-audited next month.

### Already correct, no action needed

| Check | Result |
|---|---|
| Duplicate `<title>` | None across 112 pages |
| Duplicate `metaDescription` | None |
| Dangling schema `@id` references | None; `#organization`, `#website`, `#software` all resolve |
| Canonical tags | One per page, correct |
| `hreflang` | `en`, `en-NP`, `x-default` present |
| Broken internal links | None |
| Invalid JSON-LD | None |
| Alt text on solution / feature / home pages | Already descriptive and authored |
| Font loading | `preconnect` present, `display=swap` set |
| Font weights | Requested set is slightly *under*-provisioned vs the CSS, not bloated — left alone rather than guessed at |

### Fixed

**1. 2.07 MB of dead JavaScript removed from every deploy.** `.eleventy.js` passed through
`three.module.js` (649 KB) and `three.core.js` (1.43 MB). No page referenced either — the only
match for "three" in the templates was the word in prose. The passthrough is gone; if a 3D hero is
added later, restore it and load it only on the page that needs it.

**2. Blog cover `alt` text rewritten — 59 posts, 39 distinct images.** Every blog cover had its
category name as alt text ("Operations", "Booking", "Finance"), which is useless for image search
and for a screen reader. Each image now has a description of what it actually shows. Where the
same image already had authored alt text elsewhere in `solutions.json` / `features.json`, that
wording was reused so the site describes one image one way.

Note: the ~266 empty `alt=""` attributes on card thumbnails were checked and deliberately left
alone. Those images sit next to a heading that already names the post, so an empty alt is the
correct accessibility choice — adding alt text there would make screen readers read the title twice.

**3. `WebSite` schema node now emitted on every page.** It was wrapped in `{% if page.url == "/" %}`,
but `/answers/` and `/case-study/` reference `#website` through `isPartOf`, so on those pages the
reference pointed at a node absent from the page's own graph.

### Found, not fixed — needs a decision

**Old brand name visible in live product screenshots.** Four images showed the product UI branded
**"Zenly Staff Portal"**, not "Zennly" — `og-default.jpg` (the `og:image` on all 111 pages),
`dashboard-mockup.png`, `feat-bookings-real.png` and `feat-visibility-real.png`. This directly
undercut the entity strategy in this plan: the name is supposed to be identical everywhere, and
`/faq/` carries an explicit "Zennly is not zennly.org" disambiguation while four public images
called the product Zenly.

**RESOLVED 2026-11-04.** All four replaced with re-shot versions at identical framing and
dimensions, so no template, alt text or layout changed:

| file | replaced with | size |
|---|---|---|
| `dashboard-mockup.png` | re-shot dashboard, 1536×1024 (identical crop) | 1.34 MB |
| `og-default.jpg` | the same re-shot dashboard, cropped to the original 1200×630 frame and re-encoded at q88 | 109 KB |
| `feat-bookings-real.png` | re-shot staff-portal calendar, 1739×904 | 1.23 MB |
| `feat-visibility-real.png` | re-shot branch dashboard, 947×872 (identical crop) | 220 KB |

Pages load the eleventy-img WebP derivatives (48–123 KB), not these sources; the two large PNGs
ship only to someone clicking Download in the press kit, which was already true of
`dashboard-mockup.png`.

### Still open on the images

**A phone number is still legible in `feat-bookings-real.png`** — `+9779802356754`, against the
customer name "Yukta" on the open booking card. The re-shoot fixed the brand but kept the same
booking record. This image is on the homepage Scheduling tab, is a press-kit download, and is the
cover of `/blog/how-to-choose-booking-software-nepal/`. Either re-shoot with demo data or blur the
number — it is a real number on a public marketing page.

**`feat-visibility-real.png` shows NPR 0, −100.0% revenue, 0 bookings and 1% room utilization.**
Pre-existing, not caused by the re-shoot, but it is poor marketing optics for an image used as the
cover of `/blog/gym-management-nepal/` and on four post cards. Worth re-shooting on a day with data.

**Unused:** a fourth new asset, a coral/orange phone mockup reading "Zennly — Connection and Calm",
was supplied but not installed. It uses a palette and logo mark that do not match the site's
green/sage brand, and there is no slot on the site it fits.

### Deliberately not done

- **`SearchAction` / sitelinks searchbox** on the `WebSite` node. The original reason given here
  (no `/search?q=` endpoint to point at) was the wrong reason. The real one: **Google retired the
  sitelinks searchbox on 21 November 2024** and removed its documentation, so the markup does
  nothing in Google Search now. The site has never carried it and should not start. See the
  2026-11-04 entry below.
- **`AggregateRating`** on the `SoftwareApplication` node. There are no reviews. Inventing one is
  a manual-action risk and would be a lie.
- **Critical-CSS extraction.** `tailwind.css` is 511 KB raw but 86 KB gzipped and nginx has gzip on,
  so the real cost is far smaller than it looks. Splitting it is a large, risky refactor of a
  20,000-line stylesheet for an uncertain gain; measure with real field data in Search Console →
  Core Web Vitals first, once there is traffic to measure.

---

## Site search and CSS weight — 2026-11-04

Both items had been listed as "chose not to build". Reopened and resolved.

### 1. Site search — built, then removed. Do not rebuild it.

The reason originally given for skipping it was an SEO claim, and that claim was wrong:

> **Google retired the sitelinks searchbox on 21 November 2024** and removed its
> documentation. `SearchAction` / `potentialAction` markup is no longer used for
> anything in Google Search. Leftover markup is harmless but worthless.
> ([Search Engine Journal](https://www.searchenginejournal.com/google-removes-sitelinks-search-box-documentation/533973/),
> [Search Engine Land](https://searchengineland.com/google-search-to-drop-sitelinks-search-box-447682))

The site never had `SearchAction` markup (grep: zero hits), so nothing needed removing,
and none was added. That removed the only SEO argument for a search page, leaving it a
pure usability feature.

A working `/search/` was built and then **removed the same day on the owner's call: not
worth a page.** It was a `noindex` page with a build-time index of all 110 pages
generated from `collections.all`, slug-weighted ranking, zero new CSS, and entry points
in the footer and on the 404 page. It worked; it just did not earn its place.

If anyone proposes it again, these are the facts to decide on:

- It is **not** an SEO win, and no amount of building it makes `SearchAction` worth adding.
- The in-page filters on `/blog/`, `/glossary/` and `/answers/` already cover search
  *within* those sections. A site-wide search only helps someone who does not know which
  section to look in.
- The one place it would genuinely earn its keep is the **404 page** — someone arriving
  from a dead link or a stale AI citation. If that ever shows up in the logs as a real
  volume of traffic, revisit it for the 404 page alone, not as a site-wide feature.

Reverted cleanly: `src/search.njk` deleted, the footer link and the 404 link removed,
back to 111 built pages and 110 sitemap URLs. The commit that added it is in history if
it is ever wanted back.

### 2. CSS weight — 20% of `main.css` was dead, and is now gone

The earlier "48% unused" figure was junk: the regex matched decimal fragments
like `.05rem` and `.1fr` inside declaration values as class names. Replaced with
a real analyzer, `dev_tools/find-dead-css.js`, which parses the stylesheet and
only looks at text in *selector* position.

A class counts as **used** on any of three tests — deliberately generous, because
a false "dead" breaks a page while a false "used" costs a few bytes:

1. the exact token appears anywhere in `src/` (templates, JS, JSON) or `_site/`
2. some longer project token starts with it
3. it starts with any project token ending in `-` or `_`, which covers classes
   built by concatenation, e.g. `'blog2-tone--' + i`

A rule is dead only when it has class selectors and none of them is used. Rules
with no class selector (element, `:root`, `@font-face`) are always kept.

Result: **1,000 of 3,683 rules removed, 140 KB of `main.css`.** Shipped, minified,
gzipped CSS on every one of the 111 pages:

| | before | after | change |
|---|---|---|---|
| `tailwind.css` raw | 511,009 B | 403,697 B | −107 KB (−21.0%) |
| `tailwind.css` gzip | 87,276 B | 70,174 B | **−17.1 KB (−19.6%)** |

What it was: component families whose pages or sections no longer exist —
`hiw-*` (the removed how-it-works page, ~100 rules), the old `footer__*` footer
superseded by `v2-footer-*`, `blog-idx-*` superseded by `blog2-*`,
`feat-idx-card[data-feature=…]`, `trust-band__*`, `compare-card__*`, `fd-bento`,
`about-facts`, `pg-copy`/`pg-intro`/`pg-areas`, `bk-mock`, `mock-cal`, `rpt-card`.

Verification run after the removal:

- re-running the analyzer reports **0 dead rules** (it is idempotent)
- brace balance is checked before the file is written; mismatch aborts
- **0 regressions**: of 737 classes that lost their rule, none appears in a
  `class=` attribute on any of the 111 built pages
- `npm run build` succeeds

Not critical-CSS extraction. That was the original framing and it was the wrong
tool: there is no headless browser installed here to extract an above-the-fold
rule set safely, and deleting a fifth of the file is a bigger, safer win than
inlining part of a file that was 20% dead. Critical CSS remains available later
if 70 KB gzip is still the bottleneck — measure with real field data first.

**`needs-verification`:** the regression check proves no *class attribute* lost
its styling, but it cannot prove nothing looks different. Before this merges,
click through the homepage, `/features/`, `/solutions/` and one
`/solutions/{slug}/`, `/about/`, `/blog/`, one article, `/glossary/`, `/answers/`,
`/nepal/{city}/` and `/pricing/`. Revert is `git checkout` on
`src/assets/css/main.css`.

### Also removed

`three` is gone from `package.json` dependencies. The passthrough that copied it
into the deploy was removed earlier the same day and nothing imports it.

---

## `/answers/` removed — 2026-11-04

The `/answers/` hub (all 442 site questions in one index) was built earlier the same day and
then **removed on the owner's call**. It was a visible page for everyone; showing a page to AI
crawlers while hiding it from people is cloaking and was ruled out.

Removed: `src/answers.njk`, `src/_data/answers.js`, and the four links to it (footer, the
"All 442 answers" link on `/faq/`, `llms.txt`, `llms-full.txt`). Back to 110 pages and 109
sitemap URLs. The Q&A itself is untouched — every question still lives on, and is marked up on,
the page that answers it (`FAQPage` schema on those pages is unchanged).

If agent-only access to the questions is wanted later, the right place is `llms-full.txt`, which
is a text file for AI tools and not a page.

---

## Market priority — decided 2026-11-04

**Nepal first; other countries gradually, after Nepal is covered.** Owner's decision, made after
reading Search Console (3 months): 8 clicks / 419 impressions, average position 53.3. Six of the
eight clicks came from Nepal, which supplied only 72 of the impressions. Roughly 80% of
impressions came from India, Malaysia, the UK, the US, Ireland and others on general terms
("salon management system", "spa management system") where the site ranks around page 5 and
earns almost no clicks.

What this means in practice:

- Keep investing in Nepal pages and Nepal-qualified terms. Do not chase the general
  international terms yet; they are contested by Fresha, Zenoti, Phorest and others.
- Nepali searchers type plain English without "Nepal" ("salon management software"); Google
  infers location. Keep those exact phrases in titles and headings on the key pages.
- `/global/` and the worldwide `areaServed` entries stay as they are. They are the on-ramp for
  the later phase and are not being expanded now.
- Nepal search volume for this category is small (1-3 impressions per term). SEO here is a slow
  supporting channel, not the main one. Expect a trickle, and judge results 3-4 weeks after the
  work is deployed, against the 2026-11-04 baseline above.

Current Nepal coverage: 6 city pages (Kathmandu, Lalitpur, Bhaktapur, Pokhara, Biratnagar,
Chitwan), 9 solution pages, 49 of 59 blog posts with "nepal" in the slug.
