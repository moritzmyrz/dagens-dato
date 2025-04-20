import { IconButton, Tooltip } from "@material-ui/core";
import { endOfWeek, startOfWeek } from "date-fns";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useRecoilState } from "recoil";
import ButtonBar from "../../components/ButtonBar";
import Events from "../../components/Events";
import Footer from "../../components/Footer";
import { GetDay } from "../../functions/GetDay";
import { GetMonth } from "../../functions/GetMonth";
import { GetWeekNum } from "../../functions/GetWeekNum";
import { weekDescription } from "../../functions/WeekDesc";
import { timeState } from "../../state/timeState";

interface DatePageProps {
  day: number;
  month: number;
  year: number;
}

const DatePage: NextPage<DatePageProps> = ({ day, month, year }) => {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const [time, setTime] = useRecoilState(timeState);
  // Use ref to track if URL was updated from time state
  const urlUpdatedFromTime = useRef(false);
  // Flag to prevent changing time when we're already on the correct date
  const initialSetComplete = useRef(false);

  // Set time state based on URL params when component mounts
  useEffect(() => {
    if (router.isReady && !initialSetComplete.current) {
      const dateFromUrl = new Date(year, month - 1, day);
      setTime(dateFromUrl);
      initialSetComplete.current = true;
    }
  }, [day, month, year, setTime, router.isReady]);

  // Only update URL when time state changes from user action
  useEffect(() => {
    if (!router.isReady || !initialSetComplete.current) return;

    const currentDay = time.getDate();
    const currentMonth = time.getMonth() + 1;
    const currentYear = time.getFullYear();

    // Don't trigger URL updates during initial load or if URL already matches the time
    if (currentDay === day && currentMonth === month && currentYear === year) {
      return;
    }

    // If date was changed by user (through UI), update the URL
    const dateSlug = `${currentDay}-${currentMonth}-${currentYear}`;
    router.push(`/date/${dateSlug}`, undefined, {
      shallow: true,
      scroll: false,
    });
  }, [time, router, day, month, year, router.isReady]);

  const startDateOfWeek = startOfWeek(time, { weekStartsOn: 1 });
  const endDateOfWeek = endOfWeek(time, { weekStartsOn: 1 });

  const pageTitle = `${time.getDate()}. ${GetMonth(
    time.getMonth()
  )} ${time.getFullYear()}`;
  const pageDescription = `Se hva som skjedde på ${time.getDate()}. ${GetMonth(
    time.getMonth()
  )} ${time.getFullYear()}. Historiske hendelser, fødsler og dødsfall.`;

  // Special case for November 18, 2004
  const isSpecialDate = day === 18 && month === 11;
  const specialDateDescription = isSpecialDate
    ? `${pageDescription} Fødselsdag til Moritz Andrè Myrseth.`
    : pageDescription;

  return (
    <div className="mx-auto flex h-screen flex-col">
      <NextSeo
        title={
          isSpecialDate
            ? `Moritz Andrè Myrseth's fødselsdag, ${pageTitle}`
            : pageTitle
        }
        description={specialDateDescription}
        canonical={`https://www.dagensdato.no/date/${day}-${month}-${year}`}
        openGraph={{
          type: "website",
          url: `https://www.dagensdato.no/date/${day}-${month}-${year}`,
          title: isSpecialDate
            ? `Moritz Andrè Myrseth's fødselsdag, ${pageTitle}`
            : pageTitle,
          description: specialDateDescription,
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
        {isSpecialDate && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BirthEvent",
                name: "Moritz Andrè Myrseth's Birthday",
                birthDate: "2004-11-18",
                birthPlace: {
                  "@type": "Place",
                  name: "Norway",
                },
                principal: {
                  "@type": "Person",
                  name: "Moritz Andrè Myrseth",
                },
              }),
            }}
          />
        )}
      </Head>
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <ButtonBar />
        <div className="bg-backgroundsecondary w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
          <h2 className="text-center text-xl font-bold">{GetDay(time)} </h2>

          <h1 className="text-center text-3xl font-bold">
            {`${time.getDate()}. ${GetMonth(time.getMonth())}
            ${time.getFullYear()}`}
          </h1>

          {isSpecialDate && (
            <div className="text-center mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
              <p className="font-bold">Moritz Andrè Myrseth's Fødselsdag 🎂</p>
            </div>
          )}

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
        <Events />
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const [day, month, year] = slug.split("-").map(Number);

  return {
    props: {
      day,
      month,
      year,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for today, tomorrow and yesterday for initial build
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDateSlug = (date: Date) => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  // Add November 18, 2004 to the static paths to ensure it's pre-rendered
  const specialDate = new Date(2004, 10, 18); // Month is 0-indexed (10 = November)

  return {
    paths: [
      { params: { slug: formatDateSlug(today) } },
      { params: { slug: formatDateSlug(tomorrow) } },
      { params: { slug: formatDateSlug(yesterday) } },
      { params: { slug: formatDateSlug(specialDate) } },
    ],
    fallback: "blocking",
  };
};

export default DatePage;
