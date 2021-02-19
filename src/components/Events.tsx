import axios from "axios";
import { GetMonth } from "functions/GetMonth";
import React, { useEffect, useState } from "react";
import "style/Events.scss";

const cors = "https://secret-ocean-49799.herokuapp.com/";
const api = "https://secret-shore-24919.herokuapp.com/data/";

type AppProps = {
  time: Date;
};

const Events: React.FC<AppProps> = ({ time }: AppProps) => {
  const [events, setEvents] = useState([]);

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
  // eslint-disable-next-line
  const items: any = [];

  let i = 0;

  events.forEach((str) => {
    items.push(i % 2 == 0 ? <h2>{str}</h2> : <p>{str}</p>);
    i++;
  });

  return (
    <div className="events-main">
      <h1>I Dag, Den {`${time.getDate()}. ${GetMonth(time.getMonth())}`}</h1>
      <div id="event-contents">
        <h1>År</h1>
        <h1></h1>
        {items}
      </div>
    </div>
  );
};

export default Events;
