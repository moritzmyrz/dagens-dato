import React from "react";
import Clock from "react-live-clock";
import "style/Main.scss";
import { GetMonth } from "../functions/GetMonth";
import { GetWeekNum } from "../functions/GetWeekNum";

type AppProps = {
  time: Date;
};
const Main: React.FC<AppProps> = ({ time }: AppProps) => {
  return (
    <div className="main-main">
      <div id="title">
        <h1 id="klokke">
          <Clock format={"HH:mm:ss"} ticking={true} timezone={"Europe/Oslo"} />
        </h1>
        <h1 id="dato">
          {`${time.getDate()} ${GetMonth(time.getMonth())},
          ${time.getFullYear()}`}
        </h1>
        <h1 id="uke">Uke {GetWeekNum(time)}</h1>
      </div>
    </div>
  );
};

export default Main;
