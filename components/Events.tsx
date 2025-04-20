import { Snackbar, Tab, Tabs } from "@material-ui/core";
import { Alert, Skeleton, TabContext } from "@material-ui/lab";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { GiHastyGrave } from "react-icons/gi";
import { MdCake, MdTimeline } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { timeState } from "../state/timeState";
import TabTimeline from "./TabTimeline";

const Events: React.VFC = () => {
  const time = useRecoilValue(timeState);

  // Fixed API endpoint
  const api = `/api/${new Date(time).toUTCString()}`;

  const defaultEvents = {
    historisk: ["Loading"],
    births: ["Loading"],
    deaths: ["Loading"],
    description: "Loading",
  };

  const [tab, setTab] = useState("1");
  const [events, setEvents] = useState(defaultEvents);
  const [retrying, setRetrying] = useState(false);
  const firstUpdate = useRef(true);

  const handleChange = (event: any, newTab: any) => {
    setTab(newTab);
  };

  function apiCatch(err: any) {
    setRetrying(true);
    setTimeout(() => {
      retry();
    }, 4500);
    console.error(err);
  }

  // Check if the current date is November 18
  const isNovember18 = time.getDate() === 18 && time.getMonth() === 10; // November is 10 in JavaScript (0-indexed)

  // Known events with their years
  const knownEvents: Record<string, string> = {
    "Deepwater Horizon": "2010",
    Tjernobyl: "1986",
    Challenger: "1986",
    Columbia: "2003",
    Apollo: "1969",
  };

  // Simple year extractor for the normalizer
  const findYear = (text: string): string => {
    if (!text) return "";

    // Look for year at start or anywhere
    const yearMatch = text.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
    if (yearMatch) return yearMatch[1];

    // Check for known event keywords
    for (const [event, year] of Object.entries(knownEvents)) {
      if (text.toLowerCase().includes(event.toLowerCase())) {
        return year;
      }
    }

    // Use current year if we can't determine
    return time.getFullYear().toString();
  };

  // Ensure all entries have consistent format with year-dash-description
  const normalizeEntries = (entries: string[]): string[] => {
    return entries.map((entry) => {
      // Skip empty entries or "Loading"
      if (!entry || entry === "Loading") return entry;

      // Check if the entry already contains a separator
      const hasSeparator = [" – ", " - ", " — "].some((sep) =>
        entry.includes(sep)
      );

      if (hasSeparator) {
        // Check if the first part is a year
        for (const separator of [" – ", " - ", " — "]) {
          if (entry.includes(separator)) {
            const parts = entry.split(separator);
            if (parts.length >= 2) {
              const firstPart = parts[0].trim();
              // If it's already a year, keep as is
              if (/^\d{4}$/.test(firstPart)) {
                return entry;
              }

              // Try to extract year from any part
              const year = findYear(entry);
              if (year) {
                return `${year} – ${parts.slice(1).join(separator)}`;
              }
            }
          }
        }
        return entry; // Keep original if we can't improve it
      }

      // Check if entry starts with a year (4 digits)
      const yearMatch = entry.match(/^(\d{4})/);
      if (yearMatch) {
        // Add a separator after the year
        return entry.replace(/^(\d{4})/, "$1 – ");
      }

      // Try to find a year in the entry
      const year = findYear(entry);
      return year ? `${year} – ${entry}` : entry;
    });
  };

  const retry = () => {
    setEvents(defaultEvents);
    axios
      .get(api, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        console.log("API Response:", data);

        // Special handling for November 18
        if (isNovember18) {
          // Check if Moritz's entry is already in the births array
          const hasMoritzEntry = data.births.some(
            (entry: string) =>
              entry.includes("Moritz") && entry.includes("Myrseth")
          );

          // If not, add it directly here as a fallback
          if (!hasMoritzEntry) {
            console.log("Adding Moritz manually in the component");
            data.births.unshift("2004 – Moritz André Myrseth, norsk person");
          }
        }

        // Normalize all the entries to ensure consistent formatting
        data.historisk = normalizeEntries(data.historisk);
        data.births = normalizeEntries(data.births);
        data.deaths = normalizeEntries(data.deaths);

        setEvents(data);
        setRetrying(false);
      })
      .catch((err) => apiCatch(err));
  };

  useEffect(retry, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    retry();
  }, [time]);

  return (
    <div className="bg-backgroundsecondary text-text w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        open={retrying}
      >
        <Alert severity="warning">Oops, noe skjedde. Vi fikser feilen!</Alert>
      </Snackbar>

      <h2 className="text-center text-xl font-semibold">Hendelser</h2>
      {events.description == "Loading" ? (
        <Skeleton variant="text">
          <p>
            5. februar er den 36. dagen i året. Det er 329 dager igjen av året,
            330 i skuddår.
          </p>
        </Skeleton>
      ) : (
        <p className="px-4 text-center">{events.description}</p>
      )}
      <TabContext value={`${tab}`}>
        <Tabs variant="standard" centered value={tab} onChange={handleChange}>
          <Tab
            className="text-text"
            style={{ flexShrink: 1 }}
            label="Historisk"
            value="1"
            icon={<MdTimeline className="text-text" />}
          />
          <Tab
            className="text-text"
            style={{ flexShrink: 1 }}
            label="Fødsler"
            value="2"
            icon={<MdCake className="text-text" />}
          />
          <Tab
            className="text-text"
            style={{ flexShrink: 1 }}
            label="Dødsfall"
            value="3"
            icon={<GiHastyGrave className="text-text" />}
          />
        </Tabs>
        <TabTimeline eventArray={events.historisk} tabValue="1" />
        <TabTimeline eventArray={events.births} tabValue="2" />
        <TabTimeline eventArray={events.deaths} tabValue="3" />
      </TabContext>
    </div>
  );
};

export default Events;
