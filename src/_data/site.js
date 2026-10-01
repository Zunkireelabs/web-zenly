const isProd = (process.env.ELEVENTY_ENV || "production") === "production";

module.exports = {
  name: "Zennly",
  url: isProd ? "https://zennly.io" : "https://dev-web.zenly.zunkireelabs.com",
  titleTemplate: "%s | Zennly",
  defaultTitle: "Zennly — Online Booking & Operations Platform for Service Businesses",
  defaultDescription:
    "Zennly is the multi-branch booking and operations platform for spas, salons, and appointment-based service businesses in Nepal — online booking, staff scheduling, payments, and daily reconciliation in one system.",
  defaultOgImage: "/assets/images/og-default.jpg",
  logo: "/assets/images/logo.png",
  foundingDate: "2026",
  slogan: "Booking & operations software for service businesses in Nepal",
  locale: "en_NP",
  sameAs: ["https://share.google/BgkNn87IT8ReCAgUt"]
};
