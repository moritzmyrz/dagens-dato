import { IconButton, Tooltip } from "@material-ui/core";
import { endOfWeek, startOfWeek } from "date-fns";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useTheme } from "next-themes";
import Head from "next/head";
import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import ButtonBar from "../../components/ButtonBar";
import Events from "../../components/Events";
import Footer from "../../components/Footer";
import { GetDay } from "../../functions/GetDay";
import { GetMonth } from "../../functions/GetMonth";
import { GetWeekNum } from "../../functions/GetWeekNum";
import { weekDescription } from "../../functions/WeekDesc";
import { fetchEventData, EventsData, EventData } from "../../lib/fetchEvents";
import { ParsedUrlQuery } from "querystring";

// Restore DatePageProps definition
interface DatePageProps {
  day: number;
  month: number; // Month is 1-based
  year: number;
  currentDate: string;
  events: EventsData | null;
}

interface DatePageParams extends ParsedUrlQuery {
  slug: string;
}

const DatePage: NextPage<DatePageProps> = ({
  day,
  month,
  year,
  currentDate,
  events,
}) => {
  const { setTheme, theme } = useTheme();

  const time = new Date(year, month - 1, day);

  const startDateOfWeek = startOfWeek(time, { weekStartsOn: 1 });
  const endDateOfWeek = endOfWeek(time, { weekStartsOn: 1 });

  const pageTitle = `${time.getDate()}. ${GetMonth(
    time.getMonth()
  )} ${time.getFullYear()}`;
  const pageDescription = `Se hva som skjedde på ${time.getDate()}. ${GetMonth(
    time.getMonth()
  )} ${time.getFullYear()}. Historiske hendelser, fødsler og dødsfall.`;

  return (
    <div className="mx-auto flex h-screen flex-col">
      <NextSeo
        title={pageTitle}
        description={pageDescription}
        canonical={`https://www.dagensdato.no/date/${day}-${month}-${year}`}
        openGraph={{
          type: "website",
          url: `https://www.dagensdato.no/date/${day}-${month}-${year}`,
          title: pageTitle,
          description: pageDescription,
          site_name: "Dagens Dato",
          images: [
            {
              url: "/banner.png",
              alt: "dagens dato",
              height: 1055,
              width: 3000,
            },
          ],
        }}
      />
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <ButtonBar currentDate={time} />
        <div className="bg-backgroundsecondary w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
          <h2 className="text-center text-xl font-bold">{GetDay(time)} </h2>

          <h1 className="text-center text-3xl font-bold">
            {`${time.getDate()}. ${GetMonth(time.getMonth())}
            ${time.getFullYear()}`}
          </h1>

          <Tooltip
            title={weekDescription(startDateOfWeek, endDateOfWeek)}
            arrow
            leaveTouchDelay={3000}
          >
            <h2 className="text-text text-center text-xl font-semibold">
              Uke {GetWeekNum(time)}
            </h2>
          </Tooltip>
        </div>
        <Events currentDate={time} events={events} />
        <Footer />
        <IconButton
          color="inherit"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
        </IconButton>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<
  DatePageProps,
  DatePageParams
> = async (context) => {
  const params = context.params!;
  const slug = params.slug;
  const [day, month, year] = slug.split("-").map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error(`Invalid date parts parsed from slug: ${slug}`);
    return { notFound: true };
  }

  // Use UTC to be consistent with fetchEventData and API routes
  const dateFromSlug = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(dateFromSlug.getTime())) {
    console.error(`Invalid date created from slug: ${slug}`);
    return { notFound: true };
  }

  console.log(`Fetching events for date: ${dateFromSlug.toDateString()}`);
  let eventsData: EventsData | null = null;
  try {
    // Call the function directly, passing the Date object
    eventsData = await fetchEventData(dateFromSlug);

    if (!eventsData) {
      console.warn(`No event data returned for ${slug}`);
      // Decide if this should be a 404 or just show the page with no events
      // Returning null for events allows the page to render without event data.
      // If you want a 404 when data isn't found, return { notFound: true };
    }
  } catch (error) {
    // fetchEventData already logs errors, but we can log here too if needed
    console.error(`getStaticProps error fetching events for ${slug}:`, error);
    // Optionally return notFound: true if fetch errors should result in a 404
    // return { notFound: true };
    eventsData = null; // Ensure events is null on error
  }

  return {
    props: {
      day,
      month,
      year,
      currentDate: dateFromSlug.toISOString(), // Pass ISO string for serialization
      events: eventsData, // Pass the fetched data directly
    },
    revalidate: 43200, // Revalidate every 12 hours
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  const formatDateSlug = (date: Date): string => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  let currentDate = startDate;
  while (currentDate <= endDate) {
    paths.push({ params: { slug: formatDateSlug(currentDate) } });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    paths: paths,
    fallback: "blocking",
  };
};

export default DatePage;
