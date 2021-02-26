import { Tab, Tabs } from "@material-ui/core";
import { Skeleton, TabContext, TabPanel } from "@material-ui/lab";
import axios from "axios";
import { GetMonth } from "functions/GetMonth";
import React, { useEffect, useState } from "react";
import { GiHastyGrave } from "react-icons/gi";
import { MdCake, MdTimeline } from "react-icons/md";
import "style/Events.scss";
import { makeid } from "./../functions/RandomString";

type AppProps = {
	time: Date;
};

const Events: React.FC<AppProps> = ({ time }: AppProps) => {
	const cors = "https://secret-ocean-49799.herokuapp.com/";
	const api = `https://dagens-dato.herokuapp.com/date/${time.toUTCString()}`;

	const [tab, setTab] = useState("1");
	const [events, setEvents] = useState({
		historisk: ["Lstr", "Lstr"],
		births: ["Lstr", "Lstr"],
		deaths: ["Lstr", "Lstr"],
		description: "Laster",
	});

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

	useEffect(() => {
		setEvents({
			historisk: ["Lstr", "Lstr"],
			births: ["Lstr", "Lstr"],
			deaths: ["Lstr", "Lstr"],
			description: "Laster",
		});
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
	}, [time]);

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

	const S1_skeleton = (
		<Skeleton
			variant="text"
			width={`95%`}
			height={86}
			animation="wave"
			className="skeleton"
		/>
	);

	const contentSkeleton = (
		<>
			{S1_skeleton}
			{S1_skeleton}
			{S1_skeleton}
		</>
	);

	return (
		<div className="events-main">
			<h1>Hendelser {`${time.getDate()}. ${GetMonth(time.getMonth())}`}</h1>
			<p>
				{events.description == "Laster" ? (
					<Skeleton
						variant="text"
						width={`95%`}
						style={{
							margin: "0 auto",
						}}
					></Skeleton>
				) : (
					events.description
				)}
			</p>
			<TabContext value={`${tab}`}>
				<Tabs value={tab} onChange={handleChange} centered>
					<Tab label="Historisk" value="1" icon={<MdTimeline />} />
					<Tab label="Fødsler" value="2" icon={<MdCake />} />
					<Tab label="Dødsfall" value="3" icon={<GiHastyGrave />} />
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
	);
};

export default Events;
