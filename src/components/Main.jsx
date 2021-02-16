import "./Main.scss";
import { GetMonth } from "../functions/GetMonth";
import { GetWeekNum } from "../functions/GetWeekNum";
import { Timer } from "../functions/Timer";
import { Dato } from "../functions/Dato";

import Clock from "react-live-clock";

const Main = (props) => {
  return (
    <div className="main-main">
      <div id="title">
        <h1 id="klokke">
          <Clock format={"HH:mm:ss"} ticking={true} timezone={"Europe/Oslo"} />
        </h1>
        <h1 id="dato">
          {`${props.time.getDate()} ${GetMonth(props.time.getMonth())},
          ${props.time.getFullYear()}`}
        </h1>
        <h1 id="uke">Uke {GetWeekNum(props.time)}</h1>
      </div>
    </div>
  );
};

export default Main;
