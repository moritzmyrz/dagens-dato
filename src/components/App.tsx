import { Button } from "@material-ui/core";
import { Dato } from "functions/Date";
import * as React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "style/App.scss";
import Main from "./Main";
import Title from "./Title";

const App: React.FC = () => {
	const [time, setTime] = React.useState(Dato);
	const day = 86400000;

	return (
		<div id="app-main">
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
			<Main time={time}></Main>
			<Title time={time}></Title>
			<Button
				variant="contained"
				className="nav-btn"
				id="navbtn2"
				onClick={() => {
					setTime(new Date(time.getTime() + 1 * day));
				}}
			>
				<MdChevronRight />
			</Button>
		</div>
	);
};

export default App;
