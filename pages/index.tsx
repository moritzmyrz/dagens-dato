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
}

// Update component signature to accept props
const Home: NextPage<HomeProps> = ({ currentDateSlug, displayDate }) => {
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
  // We can reconstruct it here or pass it from getStaticProps
  // Let's reconstruct for simplicity here, ButtonBar only needs Date obj
  const today = new Date(); // ButtonBar needs a Date object

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
        {/* Pass today's Date object to ButtonBar */}
        <ButtonBar currentDate={today} />
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
        {/* Events component - needs currentDate prop. Pass today's date? */}
        {/* OR fetch events data in index.tsx getStaticProps if needed here? */}
        {/* Assuming Events is not essential for the *index* page functionality */}
        {/* <Events currentDate={today} events={null} /> */}
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
export const getStaticProps: GetStaticProps = async () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth(); // 0-indexed
  const year = today.getFullYear();

  const currentDateSlug = `${day}-${month + 1}-${year}`;

  const startDateOfWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endDateOfWeek = endOfWeek(today, { weekStartsOn: 1 });

  const displayDate = {
    dayName: GetDay(today),
    dayOfMonth: day,
    monthName: GetMonth(month),
    year: year,
    weekNum: GetWeekNum(today),
    weekDesc: weekDescription(startDateOfWeek, endDateOfWeek),
  };

  return {
    props: {
      currentDateSlug,
      displayDate,
    },
    revalidate: 43200, // 12 hours
  };
};
