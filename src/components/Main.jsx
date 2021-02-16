import "./Main.scss";
import { Helmet } from "react-helmet";
import { getMonth } from "../functions/GetMonth";
import { getWeekNumber } from "../functions/GetWeekNum";

const Main = (props) => {
  return (
    <div className="main-main">
      <div id="title">
        <h1>
          {props.time.getDate()}, {getMonth(props.time.getMonth()) + " "}
          {props.time.getFullYear()}
        </h1>
        <h2>Uke {getWeekNumber(props.time)}</h2>
      </div>
    </div>
  );
};

export default Main;
