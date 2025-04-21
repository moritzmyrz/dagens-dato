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
import axios from "axios";
import { EventData, EventsData } from "../../types";

// Restore DatePageProps definition
interface DatePageProps {
  day: number;
  month: number; // Month is 1-based
  year: number;
  currentDate: string;
  events: EventsData | null;
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

  const isSpecialDate = day === 18 && month === 11 && year === 2004;
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const [day, month, year] = slug.split("-").map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return { notFound: true };
  }

  const dateFromSlug = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(dateFromSlug.getTime())) {
    return { notFound: true };
  }

  const pairYearAndDescription = (entries: string[]): EventData[] => {
    const pairedEntries: EventData[] = [];
    if (
      !entries ||
      entries.length === 0 ||
      (entries.length === 1 && entries[0] === "Loading")
    ) {
      return [];
    }

    for (let i = 0; i < entries.length; i += 2) {
      const yearStr = entries[i];
      const description = entries[i + 1];

      if (yearStr && description) {
        pairedEntries.push({
          year: yearStr.trim(),
          description: description.trim(),
        });
      } else if (yearStr) {
        console.warn(`Lone entry found: ${yearStr}`);
      }
    }
    return pairedEntries;
  };

  let eventsData: EventsData | null = null;
  try {
    const apiUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || ""
    }/api/${dateFromSlug.toUTCString()}`;
    console.log(`Fetching events from: ${apiUrl}`);
    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    const data = response.data;

    const isNovember18 = day === 18 && month === 11;
    if (isNovember18 && year === 2004) {
      const hasMoritzEntry = data.births.some(
        (entry: string) => entry.includes("Moritz") && entry.includes("Myrseth")
      );
      if (!hasMoritzEntry) {
        data.births.unshift("Moritz André Myrseth, norsk person");
        data.births.unshift("2004");
      }
    }

    eventsData = {
      historisk: pairYearAndDescription(data.historisk),
      births: pairYearAndDescription(data.births),
      deaths: pairYearAndDescription(data.deaths),
      description: data.description || "Ingen beskrivelse tilgjengelig.",
    };
  } catch (error) {
    console.error(`Error fetching events for ${slug}:`, error);
    eventsData = null;
  }

  return {
    props: {
      day,
      month,
      year,
      currentDate: dateFromSlug.toISOString(),
      events: eventsData,
    },
    revalidate: 43200,
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
