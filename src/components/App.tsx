import DateFnsUtils from "@date-io/date-fns";
import { Button, ButtonGroup, ThemeProvider, Tooltip } from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Dato } from "functions/Date";
import { GetMonth } from "functions/GetMonth";
import { theme } from "functions/Theme";
import * as React from "react";
import { useEffect, useState } from "react";
import { CgCalendarToday } from "react-icons/cg";
import { MdChevronLeft, MdChevronRight, MdHome } from "react-icons/md";
import "style/app.scss";
import Content from "./content";

const App: React.FC = () => {
	const [time, setTime] = useState(Dato);
	const day = 86400000;
	const [selectDateDialog, setselectDateDialog] = useState(false);

	useEffect(() => {
		document.title = `${time.getDate()}. ${GetMonth(time.getMonth())}`;
	}, [time]);

	const handleSetDateChange = (date) => {
		setTime(date);
		setselectDateDialog(false);
	};

	return (
		<ThemeProvider theme={theme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					disableToolbar
					className="hidden"
					format="dd/MM"
					open={selectDateDialog}
					onClose={() => {
						setselectDateDialog(false);
					}}
					value={time}
					cancelLabel="Avbryt"
					okLabel="OK"
					onChange={handleSetDateChange}
				/>
			</MuiPickersUtilsProvider>
			<div id="app-main">
				<ButtonGroup>
					<Tooltip title="Forrige Dato" arrow TransitionComponent={Zoom}>
						<Button
							variant="contained"
							className="nav-btn"
							id="navbtn1"
							onClick={() => {
								setTime(new Date(time.getTime() - 1 * day));
							}}
						>
							<MdChevronLeft />
						</Button>
					</Tooltip>
					<Tooltip title="Dagens Dato" arrow TransitionComponent={Zoom}>
						<Button
							variant="contained"
							className="nav-btn"
							id="navbtn2"
							onClick={() => {
								setTime(new Date());
							}}
						>
							<MdHome />
						</Button>
					</Tooltip>
					<Tooltip title="Velg Dato" arrow TransitionComponent={Zoom}>
						<Button
							variant="contained"
							className="nav-btn"
							id="navbtn2"
							onClick={() => {
								setselectDateDialog(true);
							}}
						>
							<CgCalendarToday />
						</Button>
					</Tooltip>
					<Tooltip title="Neste Dato" arrow TransitionComponent={Zoom}>
						<Button
							variant="contained"
							className="nav-btn"
							id="navbtn4"
							onClick={() => {
								setTime(new Date(time.getTime() + 1 * day));
							}}
						>
							<MdChevronRight />
						</Button>
					</Tooltip>
				</ButtonGroup>
				<div className="content">
					<Content time={time}></Content>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default App;
