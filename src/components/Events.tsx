import { Tab, Tabs } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { TabContext, TabPanel } from "@material-ui/lab";
import axios from "axios";
import { GetMonth } from "functions/GetMonth";
import React, { useEffect, useState } from "react";
import "style/Events.scss";

const cors = "https://secret-ocean-49799.herokuapp.com/";
const api = "https://secret-shore-24919.herokuapp.com/data/";

type AppProps = {
	time: Date;
};

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#415a77",
		},
		secondary: {
			main: "#778da9",
		},
		info: {
			main: "#ff0000",
		},
	},
	overrides: {
		// Style sheet name ⚛️
		MuiButton: {
			// Name of the rule
			text: {
				// Some CSS
				color: "white",
			},
		},
	},
});

const Events: React.FC<AppProps> = ({ time }: AppProps) => {
	const [events, setEvents] = useState({
		historyData: [],
		birthData: [],
		deathData: [],
		description: "",
	});
	const [tab, setTab] = useState("1");

	const handleChange = (event, newTab) => {
		setTab(newTab);
	};

	useEffect(() => {
		axios
			.get(cors + api, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				console.log(response);
				setEvents(response.data);
			});
	}, []);
	// eslint-disable-next-line
	const historyData: any = [];
	let i = 0;
	events.historyData.forEach((str) => {
		historyData.push(
			i % 2 == 0 ? <h2 key={str}>{str}</h2> : <p key={str}>{str}</p>
		);
		i++;
	});
	// eslint-disable-next-line
	const deathData: any = [];
	let j = 0;
	events.deathData.forEach((str) => {
		deathData.push(
			j % 2 == 0 ? <h2 key={str}>{str}</h2> : <p key={str}>{str}</p>
		);
		j++;
	});
	// eslint-disable-next-line
	const birthData: any = [];
	let k = 0;
	events.birthData.forEach((str) => {
		birthData.push(
			k % 2 == 0 ? <h2 key={str}>{str}</h2> : <p key={str}>{str}</p>
		);
		k++;
	});

	return (
		<ThemeProvider theme={theme}>
			<div className="events-main">
				<h1>I Dag, Den {`${time.getDate()}. ${GetMonth(time.getMonth())}`}</h1>
				<p>{events.description}</p>
				<TabContext value={`${tab}`}>
					<Tabs
						textColor="secondary"
						color="text"
						indicatorColor="primary"
						value={tab}
						onChange={handleChange}
						centered
					>
						<Tab label="Historie" value="1"></Tab>
						<Tab label="Fødsler" value="2"></Tab>
						<Tab label="Dødsfall" value="3"></Tab>
					</Tabs>
					<TabPanel value="1" className="event-contents">
						{historyData}
					</TabPanel>
					<TabPanel value="2" className="event-contents">
						{birthData}
					</TabPanel>
					<TabPanel value="3" className="event-contents">
						{deathData}
					</TabPanel>
				</TabContext>
			</div>
		</ThemeProvider>
	);
};

export default Events;
