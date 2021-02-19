import axios from "axios";
import React, { useEffect, useState } from "react";
import "style/Events.scss";

const cors = "https://secret-ocean-49799.herokuapp.com/";
const api = "https://secret-shore-24919.herokuapp.com/data/";

const Events: React.FC = () => {
  const [events, setEvents] = useState(["Loading"]);
  const items = [];

  useEffect(() => {
    axios
      .get(cors + api, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setEvents(response.data);
      });
  }, []);

  for (const [index, value] of events.entries()) {
    const values = value.split(" – ");
    items.push(
      <div key={index}>
        <p>
          <b>{values[0]}</b>
        </p>
        {values[1]}
      </div>
    );
  }

  return (
    <div className="events-main">
      <h1>På Denne Dato</h1>
      <div id="event-contents">{items}</div>
    </div>
  );
};

export default Events;
