import { Tooltip } from "@material-ui/core";
import { endOfWeek, startOfWeek } from "date-fns";
import { GetDay } from "functions/GetDay";
import { GetMonth } from "functions/GetMonth";
import { GetWeekNum } from "functions/GetWeekNum";
import { weekDescription } from "functions/WeekDesc";
import React from "react";
import "style/content.scss";
import Events from "./Events";
import Footer from "./Footer";

type AppProps = {
	time: Date;
};
const Main: React.FC<AppProps> = ({ time }: AppProps) => {
	const startDateOfWeek = startOfWeek(time, { weekStartsOn: 1 });
	const endDateOfWeek = endOfWeek(time, { weekStartsOn: 1 });

	return (
		<div id="container">
			<div className="main-top">
				<div id="title">
					<h2>{GetDay(time)} </h2>

					<h1 id="dato">
						{`${time.getDate()}. ${GetMonth(time.getMonth())}
          ${time.getFullYear()}`}
					</h1>

					<Tooltip
						title={weekDescription(startDateOfWeek, endDateOfWeek)}
						arrow
					>
						<h2 id="uke" className="noselect">
							Uke {GetWeekNum(time)}
						</h2>
					</Tooltip>
				</div>
			</div>
			<Events time={time} />
			<Footer time={time} />
		</div>
	);
};

export default Main;
