/** @type {import('next-sitemap').IConfig} */

// Generate date URLs for the sitemap - for the past 5 years and next 1 year
function generateDateUrls() {
  const urls = [];
  const now = new Date();

  // Generate URLs for dates from 5 years ago to 1 year in the future
  const startYear = now.getFullYear() - 5;
  const endYear = now.getFullYear() + 1;

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      // Calculate days in month
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        urls.push(`/date/${day}-${month + 1}-${year}`);
      }
    }
  }

  return urls;
}

module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.dagensdato.no",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/server-sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://www.dagensdato.no/server-sitemap.xml"],
  },
  transform: async (config, path) => {
    // Custom transform function to add date paths
    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "monthly",
      priority: path === "/" ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    const urls = generateDateUrls();
    return urls.map((path) => ({
      loc: path,
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));
  },
};
