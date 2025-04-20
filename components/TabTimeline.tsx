import { Tooltip } from "@material-ui/core";
import {
  Skeleton,
  TabPanel,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import { useRecoilValue } from "recoil";
import { timeState } from "../state/timeState";

const TabTimeline: React.VFC<{
  tabValue: string;
  eventArray: string[];
}> = ({ tabValue, eventArray }) => {
  const time = useRecoilValue(timeState);

  interface timelineItem {
    date: string;
    description: string;
  }

  /**
   * Extract a year from a string either at the start or anywhere
   * @param text Text to extract year from
   * @returns The first 4-digit year found or empty string
   */
  const extractYear = (text: string): string => {
    if (!text) return "";

    // Look for 4 digits at the start
    const yearAtStart = text.match(/^(\d{4})/);
    if (yearAtStart) return yearAtStart[1];

    // Look for 4 digits anywhere
    const yearAnywhere = text.match(/(\d{4})/);
    if (yearAnywhere) return yearAnywhere[1];

    return "";
  };

  const makeTimeline = (events: string[]): timelineItem[] => {
    const timeline: timelineItem[] = [];

    // Handle loading state
    if (
      !events ||
      events.length === 0 ||
      (events.length === 1 && events[0] === "Loading")
    ) {
      return [{ date: "Loading", description: "Loading" }];
    }

    // First, try to determine if we have paired entries or combined entries
    const hasCombinedEntries = events.some(
      (entry) =>
        entry &&
        (entry.includes(" – ") ||
          entry.includes(" - ") ||
          entry.includes(" — "))
    );

    if (hasCombinedEntries) {
      // Handle combined entries like "2004 – Moritz André Myrseth, norsk person"
      for (let i = 0; i < events.length; i++) {
        const entry = events[i];

        // Skip entries that are undefined or empty
        if (!entry) continue;

        // Try to split the entry by different dash types
        const dashSeparators = [" – ", " - ", " — "];
        let splitEntry = [entry];
        let separatorFound = false;

        for (const separator of dashSeparators) {
          if (entry.includes(separator)) {
            splitEntry = entry.split(separator);
            separatorFound = true;
            break;
          }
        }

        if (separatorFound && splitEntry.length >= 2) {
          const datePart = splitEntry[0].trim();
          const description = splitEntry.slice(1).join(" – ").trim();

          // If the first part doesn't look like a year (not 4 digits), try to extract a year from it
          const year = /^\d{4}$/.test(datePart)
            ? datePart
            : extractYear(datePart) ||
              extractYear(description) ||
              time.getFullYear().toString();

          timeline.push({
            date: year,
            description: description,
          });
        } else {
          // No separator found, try to extract a year
          const year = extractYear(entry) || time.getFullYear().toString();
          const descWithoutYear = entry.replace(/\d{4}/, "").trim();

          timeline.push({
            date: year,
            description: descWithoutYear || entry, // If description is empty after removing year, use full entry
          });
        }
      }
    } else {
      // Handle paired entries (date and description in separate array elements)
      for (let i = 0; i < events.length; i += 2) {
        if (!events[i] && !events[i + 1]) continue;

        const datePart = events[i] || "";
        const description = events[i + 1] || "Ingen beskrivelse";

        // Extract year if the datePart is not already a 4-digit year
        const year = /^\d{4}$/.test(datePart)
          ? datePart
          : extractYear(datePart) ||
            extractYear(description) ||
            time.getFullYear().toString();

        timeline.push({
          date: year,
          description: description,
        });
      }
    }

    // Sort by year numerically (oldest first)
    return timeline.sort((a, b) => {
      const yearA = parseInt(a.date) || 0;
      const yearB = parseInt(b.date) || 0;
      return yearA - yearB;
    });
  };

  const calculateYearDifference = (year: string): string => {
    if (!year || year === "Loading" || isNaN(parseInt(year)))
      return "Ukjent år";

    const yearNum = parseInt(year);
    const currentYear = time.getFullYear();
    const diff = currentYear - yearNum;

    return diff === 0 ? "I år" : diff === 1 ? "I fjor" : `Ca. ${diff} år siden`;
  };

  return (
    <TabPanel value={tabValue}>
      <Timeline className="text-text">
        {makeTimeline(eventArray).map((o: timelineItem, i: number) => (
          <TimelineItem key={i}>
            <TimelineOppositeContent className="w-[66px] !flex-none">
              {o.date === "Loading" ? (
                <EventSkeleton>
                  <p>0000</p>
                </EventSkeleton>
              ) : (
                <Tooltip
                  leaveTouchDelay={3000}
                  title={calculateYearDifference(o.date)}
                  placement="top"
                  arrow
                  key={i}
                >
                  <p className="text-text">{o.date}</p>
                </Tooltip>
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {o.date === "Loading" ? (
                <EventSkeleton>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Animi.
                  </p>
                </EventSkeleton>
              ) : (
                <p>{o.description}</p>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </TabPanel>
  );
};

const EventSkeleton: React.FC = ({ children }) => {
  return (
    <Skeleton variant="text" animation="wave">
      {children}
    </Skeleton>
  );
};

export default TabTimeline;
