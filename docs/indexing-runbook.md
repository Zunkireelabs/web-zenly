# Getting zennly.io indexed — runbook

Written 2026-11-04. The problem this solves: `site:zennly.io` returns nothing, so none of the
site's content can be cited by Google or by AI assistants, and every search that does surface
Zennly quotes a third-party listing instead. Nothing technical is blocking it (see the verification
table in `seo-geo-aeo-plan.md`); the submissions simply have to be made and then followed up.

Do these in order. Steps 1 and 2 need a login and can only be done by a person.

---

## 1. Google Search Console — the one that matters most

Google ignores IndexNow. There is no API shortcut either: the Google Indexing API only works for
job postings and livestreams, and using it for ordinary pages does nothing. Search Console is the
only route.

### 1a. Check whether the property is verified at all

Go to https://search.google.com/search-console and look for a `zennly.io` property.

There is **no** `google-site-verification` meta tag in the templates and no `google*.html` file in
the repo, so if the property is verified it was done by DNS TXT record or via Google Analytics.
If no property exists, verification was never done and that is likely the whole explanation for
zero indexing.

### 1b. If it is not verified, add the property

Choose **Domain** property (covers `https`, `http` and every subdomain) over URL-prefix. It needs
one DNS TXT record at the registrar.

If DNS access is awkward, use a URL-prefix property for `https://zennly.io/` and the HTML-file
method instead — in that case drop the file Google gives you into `src/` and add it to the
passthrough list in `.eleventy.js` next to the existing IndexNow key file:

```js
eleventyConfig.addPassthroughCopy("src/google<token>.html");
```

Then deploy and click Verify.

### 1c. Submit the sitemap

Search Console → **Sitemaps** → enter `sitemap.xml` → Submit. Confirm it reports "Success" and a
discovered-URL count. If it says "Couldn't fetch", the property is wrong or the deploy is stale —
`https://zennly.io/sitemap.xml` returns 200 with 107 URLs as of 2026-11-04.

### 1d. Request indexing for the important pages by hand

Use **URL Inspection** → *Request indexing*. There is a daily quota of roughly 10–12, so spend it
on the pages that matter rather than all 107. Priority order:

1. `https://zennly.io/`
2. `https://zennly.io/faq/`
3. `https://zennly.io/answers/` *(once deployed)*
4. `https://zennly.io/solutions/spa/`
5. `https://zennly.io/solutions/salon/`
6. `https://zennly.io/pricing/`
7. `https://zennly.io/case-study/`
8. `https://zennly.io/compare/`
9. `https://zennly.io/nepal/kathmandu/`
10. `https://zennly.io/blog/`

### 1e. Read what Search Console actually says — this is the diagnosis

After a few days, open **Pages** (Indexing → Pages) and read the excluded reasons. This is what
distinguishes the three possible causes:

| What Pages says | What it means | What to do |
|---|---|---|
| URLs are Indexed | It was only ever a submission problem | Nothing. Move to authority work |
| **Discovered — currently not indexed** | Google knows the URL and chose not to crawl it yet | Authority problem. Backlinks, not more pages |
| **Crawled — currently not indexed** | Google fetched it and decided it was not worth indexing | Authority problem, and check the page is not thin or near-duplicate |
| Duplicate / alternate page with canonical | Canonical confusion | Check the canonical on that URL |
| Blocked by robots.txt / noindex | Something regressed | Re-check `robots.txt`; verify the deploy did not build with `ELEVENTY_ENV=development` |

That last row matters: the staging compose file passes `ELEVENTY_ENV=development`, which emits
`Disallow: /` and a `noindex` meta on every page. If production is ever built from the staging
config, the whole site goes dark. Production was verified clean on 2026-11-04.

---

## 2. Bing Webmaster Tools

Worth doing properly even though IndexNow already pushes URLs: Bing's index feeds **ChatGPT search
and Microsoft Copilot**, so it is the main lever for being cited by those assistants.

1. https://www.bing.com/webmasters — sign in.
2. Add `https://zennly.io`. The fastest route is **Import from Google Search Console** once step 1
   is done; otherwise verify by DNS TXT or by the XML file method.
3. **Sitemaps** → submit `https://zennly.io/sitemap.xml`.
4. **URL Submission** → submit the priority URLs from 1d. Bing's quota is far more generous than
   Google's (hundreds per day), so submit all of them.
5. Connect the IndexNow key under **IndexNow** so submissions are attributed to the account.

---

## 3. IndexNow — already set up, run it after every deploy

The key is live at `https://zennly.io/10666449c543422a85b0f3a9700e1039.txt`. Reaches Bing, Yandex,
Seznam and Naver. Not Google.

```sh
dev_tools/indexnow-submit.sh                      # every URL in the live sitemap
dev_tools/indexnow-submit.sh https://zennly.io/answers/   # just the new pages
```

Run it **after** the deploy, never before — submitting a URL that 404s is worse than not submitting
it. The script refuses to run if the key file is not reachable, and fails loudly on a rejected key
or a host mismatch.

---

## 4. Checks that need no login

```sh
# Is anything indexed yet?           — expect results once this works
#   Google:  site:zennly.io
#   Bing:    site:zennly.io

# Is the live site still crawlable?
curl -s https://zennly.io/robots.txt | head -3
curl -s https://zennly.io/ | grep -i -E '<meta name="robots"|<link rel="canonical"'
curl -s https://zennly.io/sitemap.xml | grep -c '<loc>'
```

Expected today: `Allow: /`, no robots meta, canonical `https://zennly.io/`, 107 URLs.

---

## 5. What to expect, honestly

Submission is not indexing. For a 2026 domain with no referring domains, Google can take weeks to
index even a correctly submitted sitemap, and may index a subset and leave the rest as
"Discovered — currently not indexed" indefinitely. Bing is usually faster and more generous.

If after 2–3 weeks Search Console shows URLs stuck on *Discovered* or *Crawled — currently not
indexed*, the conclusion is settled: it is an authority problem, and the fix is referring domains
(`docs/mentions-playbook.md`, `docs/listing-kit.md`), not more pages. Writing more content at that
point is the cheapest thing to do and the least likely to change anything.

Log each run in `docs/ai-visibility-log.md` so there is a dated record of when submission happened
and when indexing followed.
