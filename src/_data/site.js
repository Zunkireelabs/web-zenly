const isProd = (process.env.ELEVENTY_ENV || "production") === "production";

module.exports = {
  name: "Zennly",
  url: isProd ? "https://zennly.io" : "https://dev-web.zenly.zunkireelabs.com",
  titleTemplate: "%s | Zennly",
  defaultTitle: "Zennly — Online Booking & Operations Platform for Service Businesses",
  defaultDescription:
    "Zennly is the multi-branch booking and operations platform for spas, salons, and appointment-based service businesses in Nepal — online booking, staff scheduling, payments, and daily reconciliation in one system.",
  defaultOgImage: "/assets/images/og-default.jpg",
  // Brand is a text wordmark only (per docs/design_brief.md) — no logo image asset exists yet.
  logo: null,
  locale: "en_NP",
  sameAs: ["https://share.google/BgkNn87IT8ReCAgUt"]
};
