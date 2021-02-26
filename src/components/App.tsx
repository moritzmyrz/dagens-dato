import { Button, ButtonGroup, ThemeProvider, Tooltip } from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";
import { Dato } from "functions/Date";
import { theme } from "functions/Theme";
import * as React from "react";
import { MdChevronLeft, MdChevronRight, MdHome } from "react-icons/md";
import "style/App.scss";
import Main from "./Main";
import Title from "./Title";

const App: React.FC = () => {
	const [time, setTime] = React.useState(Dato);
	const day = 86400000;

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
					<Main time={time}></Main>
					<Title time={time}></Title>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default App;
