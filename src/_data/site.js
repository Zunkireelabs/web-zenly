const isProd = (process.env.ELEVENTY_ENV || "production") === "production";

module.exports = {
  isProd,
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
  alternateName: "Zennly booking software",
  disambiguatingDescription:
    "Zennly (zennly.io) is booking and operations software for service businesses in Nepal. It is not related to zennly.org.",
  telephone: "+977-9747491787",
  address: {
    locality: "Lalitpur",
    region: "Bagmati Province",
    postalCode: "44600",
    country: "NP"
  },
  parentOrganization: { name: "Zunkireelabs", url: "https://zunkireelabs.com" },
  // Add only live, verified profile URLs (listings, socials) below.
  sameAs: [
    "https://www.g2.com/products/zennly",
    "https://www.goodfirms.co/software/zennly",
    "https://share.google/OMw78VXlwqW4GTaON",
    "https://www.capterra.com/p/10263080/Zennly/",
    "https://www.softwareadvice.com.au/software/764131/Zennly",
    "https://www.getapp.com.au/software/2367946/zennly"
  ]
};
