// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import wiki from "wikijs";
import { splitMulti } from "../../functions/api/SplitMulti";
import { GetMonth } from "../../functions/GetMonth";

// Updated type to match the actual data structure
type DateData = {
  historisk: string[];
  births: string[];
  deaths: string[];
  description: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DateData | any>
) {
  // Parse the date parameter more safely to avoid timezone issues
  const dateParam = req.query.date as string;
  let date: Date;

  try {
    // If ISO string is provided, use it directly
    if (dateParam.includes("T")) {
      date = new Date(dateParam);
    } else {
      // Otherwise treat as UTC string
      date = new Date(dateParam);
    }

    // Ensure we're using the local date representation for Wikipedia lookups
    // This ensures we get the right day regardless of timezone
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12 // Use noon to avoid any timezone boundary issues
    );

    date = localDate;
  } catch (error) {
    console.error("Date parsing error:", error);
    date = new Date(); // Fallback to current date
  }

  console.log("API requested date:", date);
  console.log("Date components for API request:", {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    monthName: GetMonth(date.getMonth()).toLowerCase(),
  });

  if (req.method == "GET") {
    // Construct the Wikipedia page name using the date's day and month
    const wikipediaPage = `${date.getDate()}. ${GetMonth(
      date.getMonth()
    ).toLowerCase()}`;
    console.log("Fetching Wikipedia page:", wikipediaPage);

    wiki({ apiUrl: "https://no.wikipedia.org/w/api.php" })
      .page(wikipediaPage)
      .then(async (page) => {
        const content = await page.content();
        const rawContent = await page.rawContent();
        const summary = await page.summary();

        let description = summary.replace(/\r?\n|\r/g, " ");
        console.log(
          "Description retrieved:",
          description.substring(0, 50) + "..."
        );

        const splitter = [" - ", " – ", " — ", /\d+(\s–\s)/gm];

        const data: DateData = {
          historisk: [],
          births: [],
          deaths: [],
          description,
        };

        // @ts-ignore
        let historisk = await content.find(
          (obj: any) => obj.title === "Historie"
        );
        if (historisk.items != undefined) {
          var norskHistorie = historisk.items
            .find(
              (object: any) => object.title.toLowerCase() === "norsk historie"
            )
            .content.split("\n");
        } else {
          console.log("Error: No historisk.items found");
        }
        historisk = historisk.content;
        historisk = historisk.split("\n");
        if (historisk.items != undefined) historisk.push(...norskHistorie);
        historisk.sort(
          (a: string, b: string) =>
            parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0])
        );

        // @ts-ignore
        let births = await content.find((obj: any) => obj.title === "Fødsler");
        births = births.content;
        births = births.split("\n");

        // @ts-ignore
        let deaths = await content.find((obj: any) => obj.title === "Dødsfall");
        deaths = deaths.content;
        deaths = deaths.split("\n");

        var i = 0;
        for (let [i, v] of historisk.reverse().entries()) {
          v = splitMulti(v, splitter);
          // @ts-ignore
          data.historisk.push(...v);
          i++;
        }

        var j = 0;
        for (let [i, v] of births.reverse().entries()) {
          v = splitMulti(v, splitter);
          // @ts-ignore
          data.births.push(...v);
          j++;
        }

        var k = 0;
        for (let [i, v] of deaths.reverse().entries()) {
          v = splitMulti(v, splitter);
          // @ts-ignore
          data.deaths.push(...v);
          k++;
        }

        // Add special event for November 18
        // Check month more robustly - November is 10 in JS Date (0-indexed)
        const isNovember18 = date.getDate() === 18 && date.getMonth() === 10;

        console.log("Date check for Moritz:", {
          isNovember18,
          date: date.toISOString(),
        });

        if (isNovember18) {
          console.log("Adding Moritz to births list");

          // Check if Moritz is already in the list
          const hasMoritzEntry = data.births.some(
            (entry: string) =>
              entry.includes("Moritz") && entry.includes("Myrseth")
          );

          if (!hasMoritzEntry) {
            // Add Moritz Andrè Myrseth's birth to the births array
            // Using the proper format with dash separator
            // @ts-ignore
            data.births.unshift("2004 – Moritz André Myrseth, norsk person");
          }
        }

        console.log("Final births count:", data.births.length);
        // Set status and send response
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error("Wiki API error:", err);
        res.status(400).send(err);
      });
  } else {
    res.status(405).end(); // Method not allowed
  }
}
