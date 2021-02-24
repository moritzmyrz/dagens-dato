import { Tab, Tabs } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Skeleton, TabContext, TabPanel } from "@material-ui/lab";
import axios from "axios";
import { Dato } from "functions/Date";
import { GetMonth } from "functions/GetMonth";
import React, { useEffect, useState } from "react";
import "style/Events.scss";
import { makeid } from "./../functions/RandomString";

const cors = "https://secret-ocean-49799.herokuapp.com/";
const api = `https://secret-shore-24919.herokuapp.com/date/${Dato.toUTCString()}`;

type AppProps = {
	time: Date;
};

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#03045e",
		},
		secondary: {
			main: "#023e8a",
		},
	},
});

const Events: React.FC<AppProps> = ({ time }: AppProps) => {
	const [events, setEvents] = useState({
		historisk: ["Lstr", "Lstr"],
		births: ["Lstr", "Lstr"],
		deaths: ["Lstr", "Lstr"],
		description: "Laster",
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

	events.historisk.forEach((str) => {
		historyData.push(
			i % 2 === 0 ? (
				<h2 key={makeid(7)}>{str}</h2>
			) : (
				<p key={makeid(7)}>{str}</p>
			)
		);
		i++;
	});

	// eslint-disable-next-line
	const birthData: any = [];
	let k = 0;

	events.births.forEach((str) => {
		birthData.push(
			k % 2 === 0 ? (
				<h2 key={makeid(7)}>{str}</h2>
			) : (
				<p key={makeid(7)}>{str}</p>
			)
		);
		k++;
	});
	// eslint-disable-next-line
	const deathData: any = [];
	let j = 0;

	events.deaths.forEach((str) => {
		deathData.push(
			j % 2 === 0 ? (
				<h2 key={makeid(7)}>{str}</h2>
			) : (
				<p key={makeid(7)}>{str}</p>
			)
		);
		j++;
	});

	const contentSkeleton = (
		<Skeleton variant="text" width={632} height={172} animation="wave" />
	);

	return (
		<ThemeProvider theme={theme}>
			<div className="events-main">
				<h1>I dag, {`${time.getDate()}. ${GetMonth(time.getMonth())}`}</h1>
				<p>
					{events.description == "Laster" ? (
						<Skeleton
							variant="text"
							width={632}
							style={{
								margin: "0 auto",
							}}
						/>
					) : (
						events.description
					)}
				</p>
				<TabContext value={`${tab}`}>
					<Tabs
						textColor="secondary"
						color="text"
						indicatorColor="primary"
						value={tab}
						onChange={handleChange}
						centered
					>
						<Tab label="Historisk" value="1"></Tab>
						<Tab label="Fødsler" value="2"></Tab>
						<Tab label="Dødsfall" value="3"></Tab>
					</Tabs>
					<TabPanel value="1">
						<div className="event-contents">
							{events.historisk[0] == "Lstr" ? contentSkeleton : historyData}
						</div>
					</TabPanel>
					<TabPanel value="2">
						<div className="event-contents">
							{events.births[0] == "Lstr" ? contentSkeleton : birthData}
						</div>
					</TabPanel>
					<TabPanel value="3">
						<div className="event-contents">
							{events.deaths[0] == "Lstr" ? contentSkeleton : deathData}
						</div>
					</TabPanel>
				</TabContext>
			</div>
		</ThemeProvider>
	);
};

export default Events;
