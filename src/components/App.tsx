import { Dato } from "functions/Date";
import * as React from "react";
import "style/App.scss";
import Main from "./Main";
import Title from "./Title";

const App: React.FC = () => {
	const [time, setTime] = React.useState(Dato);

	return (
		<div id="app-main">
			<Main time={time}></Main>
			<Title time={time}></Title>
		</div>
	);
};

export default App;
