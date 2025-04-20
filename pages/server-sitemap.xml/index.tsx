import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";

// Generate date URLs for the sitemap - for all dates
function generateDateUrls() {
  const fields: ISitemapField[] = [];
  const now = new Date();

  // Generate URLs for dates from 5 years ago to 1 year in the future
  const startYear = now.getFullYear() - 5;
  const endYear = now.getFullYear() + 1;

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      // Calculate days in month
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        fields.push({
          loc: `https://www.dagensdato.no/date/${day}-${month + 1}-${year}`,
          lastmod: new Date().toISOString(),
          changefreq: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  return fields;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const fields = generateDateUrls();

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
