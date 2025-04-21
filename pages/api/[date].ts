// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchEventData, EventsData } from "../../lib/fetchEvents"; // Import the new function

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventsData | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const dateString = req.query.date as string;
  if (!dateString) {
    return res.status(400).json({ error: "Date query parameter is required." });
  }

  try {
    // Use UTC date parsing to match the function expectation
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const data = await fetchEventData(date);

    if (data) {
      res.status(200).json(data);
    } else {
      // Handle the case where fetchEventData returned null (e.g., wiki page not found or error)
      res.status(404).json({ error: "Data not found for the specified date." });
    }
  } catch (error) {
    console.error(`API Error fetching events for ${dateString}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
