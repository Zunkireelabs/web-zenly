#!/usr/bin/env node
/**
 * find-dead-css.js — report (and optionally remove) CSS rules whose class
 * selectors are referenced nowhere in the project.
 *
 *   node dev_tools/find-dead-css.js            # report only
 *   node dev_tools/find-dead-css.js --write    # rewrite main.css, keep a .bak
 *
 * Run `npx @11ty/eleventy` first: the analysis reads _site/ as well as src/,
 * so a class that only ever appears in rendered output is still counted as used.
 *
 * How a class is judged USED (deliberately generous — the cost of a false
 * "dead" is a broken page, the cost of a false "used" is a few unused bytes):
 *   1. the exact token appears anywhere in src/ templates, JS, JSON, or _site/
 *   2. some longer token in the project starts with it
 *   3. it starts with any project token ending in "-" or "_", which covers
 *      classes built by string concatenation, e.g. 'blog2-tone--' + i
 * A rule is dead only when it has class selectors and NONE of them is used.
 * Rules with no class selector at all (element, :root, @font-face) are kept.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CSS = path.join(ROOT, "src/assets/css/main.css");
const WRITE = process.argv.includes("--write");

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

const corpus = [
  ...walk(path.join(ROOT, "src"), [".njk", ".js", ".json", ".txt", ".md", ".webmanifest"]),
  ...walk(path.join(ROOT, "_site"), [".html", ".js", ".xml", ".txt"]),
].filter((p) => !p.includes(`${path.sep}css${path.sep}`));

if (!corpus.some((p) => p.includes(`${path.sep}_site${path.sep}`))) {
  console.error("No files found under _site/. Build first: npx @11ty/eleventy");
  process.exit(1);
}

const tokens = new Set();
for (const p of corpus) {
  const text = fs.readFileSync(p, "utf8");
  for (const m of text.matchAll(/[A-Za-z][A-Za-z0-9_-]*/g)) tokens.add(m[0]);
}
const concatPrefixes = [...tokens].filter((t) => t.endsWith("-") || t.endsWith("_"));

const usedCache = new Map();
function isUsed(cls) {
  if (usedCache.has(cls)) return usedCache.get(cls);
  let used = tokens.has(cls);
  if (!used) for (const t of tokens) { if (t.length > cls.length && t.startsWith(cls)) { used = true; break; } }
  if (!used) for (const p of concatPrefixes) { if (cls.startsWith(p)) { used = true; break; } }
  usedCache.set(cls, used);
  return used;
}

const raw = fs.readFileSync(CSS, "utf8");
// Blank out comments in place so every offset below still points at `raw`.
const scan = raw.replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length));

const CLASS_RE = /\.(-?[_a-zA-Z][\w-]*)/g;
const rules = [];
let i = 0, selStart = 0, depth = 0;
while (i < scan.length) {
  const c = scan[i];
  if (c === "{") {
    const sel = scan.slice(selStart, i);
    if (depth === 0 && !sel.trim().startsWith("@")) {
      let d = 1, j = i + 1;
      while (j < scan.length && d > 0) {
        if (scan[j] === "{") d++;
        else if (scan[j] === "}") d--;
        j++;
      }
      const classes = [...new Set([...sel.matchAll(CLASS_RE)].map((m) => m[1]))];
      rules.push({ sel: sel.trim(), start: selStart, end: j, classes });
      i = j; selStart = j; depth = 0; continue;
    }
    depth++;
  } else if (c === "}") {
    depth--;
    if (depth <= 0) { depth = 0; selStart = i + 1; }
  }
  i++;
}

const dead = rules.filter((r) => r.classes.length && !r.classes.some(isUsed));
const deadBytes = dead.reduce((n, r) => n + (r.end - r.start), 0);

const families = new Map();
for (const r of dead) for (const c of r.classes) {
  const fam = c.split(/__|--/)[0];
  families.set(fam, (families.get(fam) || 0) + 1);
}

console.log(`main.css:        ${raw.length.toLocaleString()} bytes`);
console.log(`top-level rules: ${rules.length.toLocaleString()}`);
console.log(`dead rules:      ${dead.length.toLocaleString()}`);
console.log(`dead bytes:      ${deadBytes.toLocaleString()} (${((100 * deadBytes) / raw.length).toFixed(1)}%)`);
console.log("\nlargest dead families (rule count):");
for (const [f, n] of [...families].sort((a, b) => b[1] - a[1]).slice(0, 30)) {
  console.log(`  ${f.padEnd(28)} ${n}`);
}

if (!WRITE) {
  console.log("\nReport only. Re-run with --write to remove them (a .bak is kept).");
  process.exit(0);
}

let out = raw;
for (const r of [...dead].sort((a, b) => b.start - a.start)) {
  out = out.slice(0, r.start) + out.slice(r.end);
}
// Collapse the blank runs the deletions leave behind.
out = out.replace(/\n{3,}/g, "\n\n");

const open = (out.match(/\{/g) || []).length;
const close = (out.match(/\}/g) || []).length;
if (open !== close) {
  console.error(`\nABORTED: braces unbalanced after removal (${open} { vs ${close} }). main.css untouched.`);
  process.exit(1);
}

fs.writeFileSync(CSS + ".bak", raw);
fs.writeFileSync(CSS, out);
console.log(`\nWrote ${CSS} (${out.length.toLocaleString()} bytes, was ${raw.length.toLocaleString()}).`);
console.log(`Backup: ${CSS}.bak — delete it once the site has been checked in a browser.`);
