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
  // Extract year from text using different methods
  const extractYear = (text: string): string => {
    if (!text) return "";

    // Check for 4-digit year pattern
    const yearMatch = text.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
    if (yearMatch) return yearMatch[1];

    return "";
  };

  const makeTimeline = (events: string[]): timelineItem[] => {
    const timeline: timelineItem[] = [];

    // Handle loading state
    if (events.length === 1 && events[0] === "Loading") {
      return [{ date: "Loading", description: "Loading" }];
    }

    // First, try to determine if we have paired entries or combined entries
    const hasCombinedEntries = events.some(
      (entry) =>
        entry.includes(" – ") || entry.includes(" - ") || entry.includes(" — ")
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

        for (const separator of dashSeparators) {
          if (entry.includes(separator)) {
            splitEntry = entry.split(separator);
            break;
          }
        }

        if (splitEntry.length >= 2) {
          // We found a separator
          const date = splitEntry[0].trim();
          const description = splitEntry.slice(1).join(" – ").trim();

          // If date part is a 4-digit year, use it directly
          if (/^\d{4}$/.test(date)) {
            timeline.push({
              date,
              description,
            });
          } else {
            // Try to extract year from description if date part isn't a year
            const extractedYear = extractYear(description) || extractYear(date);

            if (extractedYear) {
              timeline.push({
                date: extractedYear,
                description,
              });
            } else {
              // We couldn't find a year, use current year for recent events as fallback
              const thisYear = time.getFullYear().toString();
              timeline.push({
                date: thisYear,
                description,
              });
            }
          }
        } else {
          // No separator found
          // Try to extract year from entry directly
          const year = extractYear(entry);

          if (year) {
            const descWithoutYear = entry.replace(year, "").trim();
            timeline.push({
              date: year,
              description: descWithoutYear || entry,
            });
          } else {
            // Last resort - use current year as a reasonable guess
            timeline.push({
              date: time.getFullYear().toString(),
              description: entry,
            });
          }
        }
      }
    } else {
      // Handle paired entries (date and description in separate array elements)
      for (let i = 0; i < events.length; i += 2) {
        if (i + 1 >= events.length) break; // Ensure we have both date and description

        const date = events[i];
        const description = events[i + 1];

        if (/^\d{4}$/.test(date)) {
          // Date is already in correct format
          timeline.push({
            date,
            description,
          });
        } else {
          // Try to extract year from description
          const year = extractYear(description) || extractYear(date);

          if (year) {
            timeline.push({
              date: year,
              description,
            });
          } else {
            // Last resort - use current year
            timeline.push({
              date: time.getFullYear().toString(),
              description,
            });
          }
        }
      }
    }

    return timeline;
  };

  return (
    <TabPanel value={tabValue}>
      <Timeline className="text-text">
        {makeTimeline(eventArray).map((o: timelineItem, i: number) => (
          <TimelineItem key={i}>
            <TimelineOppositeContent className="w-[66px] !flex-none">
              {o.date == "Loading" ? (
                <EventSkeleton>
                  <p>0000</p>
                </EventSkeleton>
              ) : (
                <Tooltip
                  leaveTouchDelay={3000}
                  title={
                    isNaN(parseInt(o.date))
                      ? "Ukjent dato"
                      : `Ca. ${time.getFullYear() - parseInt(o.date)} år siden`
                  }
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
              {o.date == "Loading" ? (
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
    <Skeleton
      variant="text"
      // width={`95%`}
      // height={86}
      animation="wave"
    >
      {children}
    </Skeleton>
  );
};

export default TabTimeline;
