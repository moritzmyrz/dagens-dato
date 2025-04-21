import { IconButton, Tooltip } from "@material-ui/core";
import { endOfWeek, startOfWeek } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useTheme } from "next-themes";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import ButtonBar from "../components/ButtonBar";
import Events from "../components/Events";
import Footer from "../components/Footer";
import { GetDay } from "../functions/GetDay";
import { GetMonth } from "../functions/GetMonth";
import { GetWeekNum } from "../functions/GetWeekNum";
import { weekDescription } from "../functions/WeekDesc";
import { fetchEventData, EventsData } from "../lib/fetchEvents";

// Define props
interface HomeProps {
  currentDateSlug: string;
  displayDate: {
    dayName: string;
    dayOfMonth: number;
    monthName: string;
    year: number;
    weekNum: number;
    weekDesc: string;
  };
  events: EventsData | null;
  currentDateISO: string;
}

// Update component signature to accept props
const Home: NextPage<HomeProps> = ({
  currentDateSlug,
  displayDate,
  events,
  currentDateISO,
}) => {
  const { setTheme, theme } = useTheme();

  // Removed Recoil state
  // const time = useRecoilValue(timeState);
  // const startDateOfWeek = startOfWeek(time, { weekStartsOn: 1 });
  // const endDateOfWeek = endOfWeek(time, { weekStartsOn: 1 });

  // Removed client-side slug generation
  // const currentDateSlug = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`;

  // Removed useEffect for title
  /*
  useEffect(() => {
    document.title = `${time.getDate()}. ${GetMonth(
      time.getMonth()
    )} | Dagens Dato`;
  }, [time]);
  */

  // Use props for ButtonBar - needs the current Date object
  // Reconstruct Date object from ISO string
  const currentDate = new Date(currentDateISO);

  return (
    <div className="mx-auto flex h-screen flex-col">
      <NextSeo
        // Title/Desc can potentially use displayDate props if needed
        title="Dagens Dato - Se hva som skjedde på dagens dato"
        description="Hvilken uke er det? Hva skjedde på dagens dato? Her finner du ut ting om dagens dato, med ett sammendrag over hva som har hendt på dagens dato."
        canonical="https://www.dagensdato.no"
        openGraph={{
          type: "website",
          url: "https://www.dagensdato.no",
          title: "Dagens Dato",
          description:
            "Hvilken uke er det? Hva skjedde på dagens dato? Her finner du ut ting om dagens dato, med ett sammendrag over hva som har hendt på dagens dato.",
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
        {/* Pass currentDate Date object to ButtonBar */}
        <ButtonBar currentDate={currentDate} />
        {/* Use currentDateSlug prop for Link href */}
        <Link href={`/date/${currentDateSlug}`} passHref>
          <div className="bg-backgroundsecondary w-[97%] rounded-xl px-4 py-2 sm:w-[500px] cursor-pointer hover:opacity-90 transition-opacity">
            {/* Use displayDate props for rendering */}
            <h2 className="text-center text-xl font-bold">
              {displayDate.dayName}
            </h2>

            <h1 className="text-center text-3xl font-bold">
              {`${displayDate.dayOfMonth}. ${displayDate.monthName}
              ${displayDate.year}`}
            </h1>

            <Tooltip
              // Use displayDate prop for tooltip
              title={displayDate.weekDesc}
              arrow
              leaveTouchDelay={3000}
            >
              <h2 className="text-text text-center text-xl font-semibold">
                {/* Use displayDate prop for week number */}
                Uke {displayDate.weekNum}
              </h2>
            </Tooltip>
          </div>
        </Link>
        {/* Render Events component with today's data */}
        <Events currentDate={currentDate} events={events} />
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

export default Home;

// Add getStaticProps
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const today = new Date();
  // Use UTC date parts consistent with fetchEventData for fetching
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const day = today.getDate(); // Keep local day for display
  const month = today.getMonth(); // Keep local month for display (0-indexed)
  const year = today.getFullYear(); // Keep local year for display

  const currentDateSlug = `${day}-${month + 1}-${year}`;

  const startDateOfWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endDateOfWeek = endOfWeek(today, { weekStartsOn: 1 });

  const displayDate = {
    dayName: GetDay(today), // Use local date for display helpers
    dayOfMonth: day,
    monthName: GetMonth(month),
    year: year,
    weekNum: GetWeekNum(today),
    weekDesc: weekDescription(startDateOfWeek, endDateOfWeek),
  };

  // Fetch events for today
  let eventsData: EventsData | null = null;
  try {
    console.log(`Fetching events for today: ${todayUTC.toDateString()}`);
    // Use the UTC date object for fetching
    eventsData = await fetchEventData(todayUTC);
    if (!eventsData) {
      console.warn(`No event data returned for today (${currentDateSlug})`);
    }
  } catch (error) {
    console.error(`getStaticProps error fetching events for today:`, error);
    eventsData = null; // Ensure events is null on error
  }

  return {
    props: {
      currentDateSlug,
      displayDate,
      events: eventsData, // Pass fetched events data
      currentDateISO: today.toISOString(), // Pass ISO string for client-side Date reconstruction
    },
    revalidate: 43200, // 12 hours
  };
};
