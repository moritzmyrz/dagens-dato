import { Snackbar, Tab, Tabs } from "@material-ui/core";
import { Alert, TabContext } from "@material-ui/lab";
import { useState } from "react";
import { GiHastyGrave } from "react-icons/gi";
import { MdCake, MdTimeline } from "react-icons/md";
import TabTimeline from "./TabTimeline";
import { EventData, EventsData } from "../types";

interface EventsProps {
  currentDate: Date;
  events: EventsData | null;
}

const Events: React.FC<EventsProps> = ({ currentDate, events }) => {
  const [tab, setTab] = useState("1");

  const handleChange = (event: any, newTab: any) => {
    setTab(newTab);
  };

  if (!events) {
    return (
      <div className="bg-backgroundsecondary text-text w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
        <Alert severity="error">
          Kunne ikke laste hendelser for denne datoen.
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-backgroundsecondary text-text w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
      <h2 className="text-center text-xl font-semibold">Hendelser</h2>
      <p className="px-4 text-center">{events.description}</p>

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
