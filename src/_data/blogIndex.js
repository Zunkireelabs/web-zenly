// Single source of truth for the blog index, the Blog schema, llms.txt and
// llms-full.txt.
//
// Card metadata lives in each post's own front matter; the only thing stored
// separately is the display ORDER, in blogOrder.json, because order is an
// index-level decision and not a property of any one post (most posts share a
// datePublished, so sorting by date cannot reproduce a curated order).
//
// Drift is a build failure, not a silent bug: if a post file is missing from
// blogOrder.json or listed there without a file, the build stops.
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const BLOG = path.join(__dirname, "..", "blog");
const ORDER = path.join(__dirname, "blogOrder.json");

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

function readableDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

module.exports = function () {
  const order = JSON.parse(fs.readFileSync(ORDER, "utf8"));
  const files = fs.readdirSync(BLOG)
    .filter((f) => f.endsWith(".njk"))
    .map((f) => f.replace(/\.njk$/, ""));

  const missing = files.filter((s) => !order.includes(s));
  const extra = order.filter((s) => !files.includes(s));
  if (missing.length || extra.length) {
    throw new Error(
      "blogIndex: src/_data/blogOrder.json is out of sync with src/blog/.\n" +
      (missing.length ? `  post files not listed in blogOrder.json: ${missing.join(", ")}\n` : "") +
      (extra.length ? `  listed in blogOrder.json but no post file: ${extra.join(", ")}\n` : "") +
      "  Add the slug to blogOrder.json (position = where it appears on /blog/)."
    );
  }

  const dupes = order.filter((s, i) => order.indexOf(s) !== i);
  if (dupes.length) throw new Error(`blogIndex: duplicate slugs in blogOrder.json: ${dupes.join(", ")}`);

  return order.map((slug) => {
    const fmData = matter(fs.readFileSync(path.join(BLOG, `${slug}.njk`), "utf8")).data;
    const need = ["h1", "category", "readTime", "datePublished", "coverImage", "cardExcerpt"];
    for (const k of need) {
      if (!fmData[k]) throw new Error(`blogIndex: src/blog/${slug}.njk is missing front-matter key "${k}"`);
    }
    return {
      slug,
      title: fmData.h1,
      tag: fmData.category,
      read: fmData.readTime,
      date: readableDate(fmData.datePublished),
      datePublished: fmData.datePublished,
      // cardImage overrides coverImage where the index art differs from the hero art.
      image: (fmData.cardImage || fmData.coverImage).replace(/^\/assets\/images\//, ""),
      excerpt: fmData.cardExcerpt,
      metaDescription: fmData.metaDescription || "",
    };
  });
};
