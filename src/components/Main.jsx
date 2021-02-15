import "./Main.scss";

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

function getMonth(month) {
  var months = [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return months[month];
}

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [weekNo];
}

export default Main;
