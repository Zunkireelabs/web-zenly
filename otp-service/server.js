// Zennly demo-code service. Sends a 6-digit code by email (Resend, from info@zennly.io) and checks it.
// Stateless: the code is never stored. /send returns a signed token (expiry + HMAC of email|expiry|code);
// /verify recomputes it. Dependency-free (Node 20: http, crypto, fetch).
const http = require("http");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === "production";
const SECRET = process.env.OTP_SECRET || (IS_PROD ? "" : crypto.randomBytes(32).toString("hex"));
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.OTP_FROM || "Zennly <info@zennly.io>";
const TTL_MS = 10 * 60 * 1000;
const SITE_URL = (process.env.SITE_URL || "https://zennly.io").replace(/\/$/, "");
// Email images come from the same site the button links to, so stage emails use stage images and live emails use zennly.io.
const LOGO_WHITE_URL = `${SITE_URL}/assets/images/email-logo-white.png`;
const PREVIEW_URL = `${SITE_URL}/assets/images/email-dashboard.png`;
const DEMO = {
  email: process.env.DEMO_LOGIN_EMAIL || "demo.customer@zunkireelabs.com",
  password: process.env.DEMO_LOGIN_PASSWORD || "ZenlyDemo2026!",
  loginUrl: process.env.DEMO_LOGIN_URL || "https://dev-zenly.zunkireelabs.com/nuad-thai-spa/login",
};
if (!SECRET) { console.error("OTP_SECRET is required in production"); process.exit(1); }
if (IS_PROD && !RESEND_API_KEY) { console.error("RESEND_API_KEY is required in production"); process.exit(1); }

// ── tiny in-memory limiter (single container) ────────────────────
const hits = new Map(); // key -> [timestamps]
function limited(key, max, windowMs) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (list.length >= max) { hits.set(key, list); return true; }
  list.push(now); hits.set(key, list); return false;
}
const attempts = new Map(); // token -> { n: wrong guesses, exp }
const used = new Map(); // token -> expiry (one-time use)
setInterval(() => {
  const now = Date.now();
  for (const [k, list] of hits) { const f = list.filter((t) => now - t < 3600e3); f.length ? hits.set(k, f) : hits.delete(k); }
  for (const [t, exp] of used) if (exp < now) used.delete(t);
  for (const [t, a] of attempts) if (a.exp < now) attempts.delete(t);
}, 60e3).unref();

// ── helpers ──────────────────────────────────────────────────────
const sign = (email, exp, code) => crypto.createHmac("sha256", SECRET).update(`${email}|${exp}|${code}`).digest("hex");
const safeEq = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
const validEmail = (s) => typeof s === "string" && s.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s);
// Behind traefik -> nginx the client is the 2nd entry from the right of X-Forwarded-For (each hop appends).
function clientIp(req) {
  const xff = String(req.headers["x-forwarded-for"] || "").split(",").map((s) => s.trim()).filter(Boolean);
  return xff.length >= 2 ? xff[xff.length - 2] : xff[0] || req.socket.remoteAddress || "?";
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 4096) { reject(new Error("too-big")); req.destroy(); } });
    req.on("end", () => { try { resolve(JSON.parse(raw || "{}")); } catch (e) { reject(e); } });
    req.on("error", reject);
  });
}
function reply(res, status, body, origin) {
  const h = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) { // local dev only; live site is same-origin
    h["Access-Control-Allow-Origin"] = origin; h["Access-Control-Allow-Headers"] = "Content-Type";
  }
  res.writeHead(status, h); res.end(JSON.stringify(body));
}
// Email body (table layout + inline styles so Gmail/Outlook render it). The button is a magic link: it reopens the
// demo window on the site with the code already entered (the site reads ?dt=&de=&dc= and verifies it straight away).
function renderEmail(name, code, link) {
  const first = (name || "").trim().split(/\s+/)[0].replace(/[<>&"']/g, "");
  const hi = first ? `Hi ${first}, here&rsquo;s your code` : "Here&rsquo;s your code";
  const digit = (d) => `<td style="padding:0 3px"><div style="width:44px;height:62px;line-height:62px;text-align:center;background:#FFFFFF;border-radius:14px;font-size:30px;font-weight:700;color:#1C1C1C;font-family:Helvetica,Arial,sans-serif">${d}</div></td>`;
  const tick = (t) => `<td align="center" valign="top" style="padding:0 4px"><div style="width:26px;height:26px;line-height:26px;margin:0 auto 8px;border-radius:50%;background:#DCEBDC;color:#3F6839;font-weight:700;font-size:14px">&#10003;</div><div style="font-size:13px;line-height:1.4;font-weight:600;color:#302E2D">${t}</div></td>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#F0E6D3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Your Zennly demo code is ${code}. Tap the button to open your demo.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0E6D3"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:28px;overflow:hidden">
 <tr><td align="center" style="background:#2F5229;background-image:radial-gradient(circle at 0% 0%,#5A8C50 0,rgba(90,140,80,0) 50%),radial-gradient(circle at 100% 100%,#1B3418 0,rgba(27,52,24,0) 60%);padding:40px 20px 44px">
  <img src="${LOGO_WHITE_URL}" alt="Zennly" width="132" style="display:block;width:132px;height:auto;margin:0 auto 30px;color:#FFFFFF;font-family:Georgia,serif;font-size:34px;line-height:40px;text-align:center">
  <span style="display:inline-block;padding:7px 16px;border-radius:999px;background:rgba(255,255,255,.14);font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#E3F0DF;font-weight:700">Free demo &middot; Verify your email</span>
  <h1 style="margin:20px 0 8px;font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-weight:400;font-size:40px;line-height:1.1;color:#FFFFFF">${hi}</h1>
  <p style="margin:0 0 28px;font-size:15px;line-height:1.5;color:#CFE3CB">Enter it in the demo window, or just tap the button below.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>${code.split("").map(digit).join("")}</tr></table>
  <p style="margin:20px 0 0;font-size:13px;color:#CFE3CB">Expires in 10 minutes &middot; works once</p>
 </td></tr>
 <tr><td align="center" style="padding:34px 24px 6px"><a href="${link}" style="display:inline-block;background:#1C1C1C;color:#FFFFFF;text-decoration:none;font-size:17px;font-weight:600;padding:18px 38px;border-radius:999px">Open my demo &rarr;</a>
  <p style="margin:14px 0 0;font-size:13px;color:#8a8d85">One tap &mdash; the code is filled in for you.</p></td></tr>
 <tr><td style="padding:28px 20px 0"><div style="background:#DCEBDC;border-radius:20px;padding:26px 18px 18px;text-align:center">
  <p style="margin:0 0 16px;font-size:12px;letter-spacing:1.4px;font-weight:700;text-transform:uppercase;color:#3F6839">What you&rsquo;re about to see</p>
  <img src="${PREVIEW_URL}" alt="Bookings, payments and your team in one dashboard" width="480" style="display:block;width:100%;max-width:480px;height:auto;margin:0 auto;color:#3F6839;font-size:14px;line-height:20px;text-align:center">
 </div></td></tr>
 <tr><td style="padding:26px 24px 4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${tick("Bookings &amp; calendar")}${tick("Payments &amp; reports")}${tick("Team &amp; payroll")}</tr></table>
  <p style="margin:22px 0 0;text-align:center;font-size:14px;line-height:1.6;color:#6A6E65">You get a login to a live sample spa. No credit card, nothing to install.</p></td></tr>
 <tr><td style="padding:24px 24px 30px;text-align:center;font-size:13px;line-height:1.6;color:#8a8d85">Didn&rsquo;t request this? You can ignore this email &mdash; nobody can get in without the code sent to your inbox.</td></tr>
 <tr><td style="background:#FFFFFF;border-top:1px solid #EFE7D8;padding:22px 24px;text-align:center;font-size:12px;line-height:1.7;color:#6A6E65">Zennly &middot; Booking software for spas, salons &amp; studios<br><a href="https://zennly.io" style="color:#3F6839;text-decoration:none;font-weight:700">zennly.io</a> &middot; <a href="mailto:info@zennly.io" style="color:#3F6839;text-decoration:none;font-weight:700">info@zennly.io</a></td></tr>
</table></td></tr></table></body></html>`;
  const text = `${first ? `Hi ${first},\n\n` : ""}Your Zennly demo code is ${code}. It expires in 10 minutes.\n\nOpen your demo (code filled in for you): ${link}\n\nIf you didn't ask for it, you can ignore this email.\n\nZennly - zennly.io`;
  return { html, text };
}
async function sendEmail(to, name, code, link) {
  if (!RESEND_API_KEY) { console.log(`[dev] code for ${to}: ${code}\n[dev] link: ${link}`); return; }
  const { html, text } = renderEmail(name, code, link);
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject: `${code} is your Zennly demo code`, text, html }),
  });
  if (!r.ok) throw new Error(`resend-${r.status}`);
}

// ── routes ───────────────────────────────────────────────────────
http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  const path = (req.url || "").split("?")[0];
  if (req.method === "OPTIONS") return reply(res, 204, {}, origin);
  if (req.method === "GET" && path === "/health") return reply(res, 200, { ok: true });
  if (req.method !== "POST") return reply(res, 404, { error: "not-found" }, origin);
  let body;
  try { body = await readJson(req); } catch (e) { return reply(res, 400, { error: "bad-request" }, origin); }
  const ip = clientIp(req);
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").replace(/[^\d+]/g, "");
  const viaSms = !email && !!phone;
  const dest = viaSms ? phone : email; // what the code is bound to

  if (path.endsWith("/send")) {
    if (viaSms) {
      // SMS codes will be sent through EdgeX once it is connected; until then say so instead of failing silently.
      if (!/^\+?\d{8,15}$/.test(phone)) return reply(res, 400, { error: "invalid-phone" }, origin);
      return reply(res, 501, { error: "sms-unavailable" }, origin);
    }
    if (!validEmail(email)) return reply(res, 400, { error: "invalid-email" }, origin);
    if (limited(`ip-send:${ip}`, 8, 10 * 60e3) || limited(`mail-send:${email}`, 5, 60 * 60e3)) return reply(res, 429, { error: "too-many" }, origin);
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    const exp = Date.now() + TTL_MS;
    const token = `${exp}.${sign(email, exp, code)}`;
    const link = `${SITE_URL}/?dt=${token}&de=${encodeURIComponent(email)}&dc=${code}`;
    try { await sendEmail(email, body.name, code, link); }
    catch (e) { console.error("send failed:", e.message); return reply(res, 502, { error: "send-failed" }, origin); }
    return reply(res, 200, { token }, origin);
  }

  if (path.endsWith("/verify")) {
    const code = String(body.code || "");
    const token = String(body.token || "");
    const [expStr, mac] = token.split(".");
    const exp = Number(expStr);
    if (!validEmail(email) || !/^\d{6}$/.test(code) || !mac || !Number.isFinite(exp)) return reply(res, 400, { error: "bad-request" }, origin);
    if (limited(`ip-verify:${ip}`, 30, 10 * 60e3)) return reply(res, 429, { error: "too-many" }, origin);
    if (exp < Date.now()) return reply(res, 400, { error: "expired" }, origin);
    if (used.has(token) || (attempts.get(token)?.n || 0) >= 5) return reply(res, 400, { error: "invalid-code" }, origin);
    if (!safeEq(mac, sign(email, exp, code))) {
      attempts.set(token, { n: (attempts.get(token)?.n || 0) + 1, exp });
      return reply(res, 400, { error: "invalid-code" }, origin);
    }
    used.set(token, exp); // one-time use
    return reply(res, 200, DEMO, origin);
  }
  reply(res, 404, { error: "not-found" }, origin);
}).listen(PORT, () => console.log(`otp-service on :${PORT}${RESEND_API_KEY ? "" : " (no RESEND_API_KEY: codes are logged)"}`));
