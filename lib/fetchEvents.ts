import wiki from "wikijs";
import { splitMulti } from "../functions/api/SplitMulti"; // Adjusted path
import { GetMonth } from "../functions/GetMonth"; // Adjusted path

// Define a type for the raw event data structure if needed, based on usage
// Example structure, adjust as needed
interface RawEventData {
  historisk: string[];
  births: string[];
  deaths: string[];
  description: string;
}

// Define the structure for the processed event data
// Assuming EventData is defined elsewhere, or define it here:
export interface EventData {
  year: string;
  description: string;
}

export interface EventsData {
  historisk: EventData[];
  births: EventData[];
  deaths: EventData[];
  description: string;
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
      // Handle lone entries if necessary, e.g., log a warning
      // console.warn(`Lone entry found: ${yearStr}`);
    }
  }
  return pairedEntries;
};

export async function fetchEventData(date: Date): Promise<EventsData | null> {
  try {
    const pageTitle = `${date.getUTCDate()}. ${GetMonth(
      date.getUTCMonth()
    ).toLowerCase()}`;
    const wikiPage = await wiki({
      apiUrl: "https://no.wikipedia.org/w/api.php",
    }).page(pageTitle);

    const content = await wikiPage.content();
    const summary = await wikiPage.summary();
    let description = summary.replace(/\r?\n|\r/g, " ");

    const splitter = [" - ", " – ", " — ", /\d+(\s–\s)/gm];

    const rawData: RawEventData = {
      historisk: [],
      births: [],
      deaths: [],
      description,
    };

    // Extract sections - check if content is an array first
    const extractSection = (sectionTitle: string): string[] => {
      // Ensure content is an array and has the find method
      if (!Array.isArray(content)) {
        console.warn(
          `Wiki content for page '${pageTitle}' is not an array, cannot extract sections.`
        );
        return [];
      }
      const section = content.find(
        (obj: any) => obj.title?.toLowerCase() === sectionTitle.toLowerCase()
      );
      let items: string[] = [];
      if (section?.content) {
        items = section.content.split("\n");
      }
      // Handle subsections like "Norsk historie" within "Historie"
      if (section?.title?.toLowerCase() === "historie" && section?.items) {
        const norskHistorieSection = section.items.find(
          (sub: any) => sub.title?.toLowerCase() === "norsk historie"
        );
        if (norskHistorieSection?.content) {
          items.push(...norskHistorieSection.content.split("\n"));
        }
      }
      return items.filter((item) => item.trim() !== ""); // Filter out empty lines
    };

    let historiskRaw = extractSection("Historie"); // Changed to Historie
    let birthsRaw = extractSection("Fødsler");
    let deathsRaw = extractSection("Dødsfall");

    // Sort historical events by year if needed (assuming year is the first part)
    historiskRaw.sort(
      (a: string, b: string) =>
        parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0])
    );

    // Process and split entries
    historiskRaw.reverse().forEach((v) => {
      rawData.historisk.push(...splitMulti(v, splitter));
    });
    birthsRaw.reverse().forEach((v) => {
      rawData.births.push(...splitMulti(v, splitter));
    });
    deathsRaw.reverse().forEach((v) => {
      rawData.deaths.push(...splitMulti(v, splitter));
    });

    // Special handling for November 18th (Moritz's Birthday)
    const isNovember18 = date.getUTCDate() === 18 && date.getUTCMonth() === 10; // November is month 10
    if (isNovember18) {
      const hasMoritzEntry = rawData.births.some(
        (entry: string) => entry.includes("Moritz") && entry.includes("Myrseth")
      );
      if (!hasMoritzEntry) {
        // Find the correct index to insert based on year 2004
        let insertIndex = rawData.births.length; // Default to end
        for (let i = 0; i < rawData.births.length; i += 2) {
          // Assuming year is always the first element of the pair
          const year = parseInt(rawData.births[i], 10);
          if (year > 2004) {
            insertIndex = i;
            break;
          }
        }
        rawData.births.splice(insertIndex, 0, "2004", "Moritz André Myrseth");
      }
    }

    // Pair years and descriptions
    const eventsData: EventsData = {
      historisk: pairYearAndDescription(rawData.historisk),
      births: pairYearAndDescription(rawData.births),
      deaths: pairYearAndDescription(rawData.deaths),
      description: rawData.description || "Ingen beskrivelse tilgjengelig.",
    };

    return eventsData;
  } catch (error) {
    console.error(
      `Error fetching event data for ${date.toDateString()}:`,
      error
    );
    // Decide how to handle errors, e.g., return null or throw
    return null;
  }
}
