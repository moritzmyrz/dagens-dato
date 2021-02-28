import { Button, ButtonGroup, ThemeProvider, Tooltip } from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";
import { Dato } from "functions/Date";
import { GetMonth } from "functions/GetMonth";
import { theme } from "functions/Theme";
import * as React from "react";
import { useEffect } from "react";
import { MdChevronLeft, MdChevronRight, MdHome } from "react-icons/md";
import "style/App.scss";
import Content from "./Content";

const App: React.FC = () => {
	const [time, setTime] = React.useState(Dato);
	const day = 86400000;

	useEffect(() => {
		document.title = `${time.getDate()}. ${GetMonth(time.getMonth())}`;
	}, [time]);

	return (
		<ThemeProvider theme={theme}>
			<div id="app-main">
				<ButtonGroup>
					<Tooltip title="Tilbake" arrow TransitionComponent={Zoom}>
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
					<Tooltip title="Hjem" arrow TransitionComponent={Zoom}>
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
					<Tooltip title="Neste" arrow TransitionComponent={Zoom}>
						<Button
							variant="contained"
							className="nav-btn"
							id="navbtn3"
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
