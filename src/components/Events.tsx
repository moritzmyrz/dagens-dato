import { Snackbar, Tab, Tabs, Tooltip } from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";
import { Alert, Skeleton, TabContext, TabPanel } from "@material-ui/lab";
import axios from "axios";
import { GetMonth } from "functions/GetMonth";
import React, { useEffect, useRef, useState } from "react";
import { GiHastyGrave } from "react-icons/gi";
import { MdCake, MdTimeline } from "react-icons/md";
import "style/events.scss";
import { makeid } from "../functions/RandomString";

type AppProps = {
	time: Date;
};

const Events: React.FC<AppProps> = ({ time }: AppProps) => {
	const api = `https://dagens-dato.herokuapp.com/date/${new Date(
		time.getTime() + 60 * 60 * 1000
	).toUTCString()}`;

	const defaultEvents = {
		historisk: ["Lstr", "Lstr"],
		births: ["Lstr", "Lstr"],
		deaths: ["Lstr", "Lstr"],
		description: "Laster",
	};

	const [tab, setTab] = useState("1");
	const [events, setEvents] = useState(defaultEvents);
	const [retrying, setRetrying] = useState(false);
	const firstUpdate = useRef(true);
	// eslint-disable-next-line prefer-const

	const handleChange = (event, newTab) => {
		setTab(newTab);
	};

	function apiCatch(err) {
		setRetrying(true);
		setTimeout(() => {
			retry();
		}, 4500);
		console.error(err);
	}

	const retry = () => {
		setEvents(defaultEvents);
		axios
			.get(api, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				setEvents(response.data);
				setRetrying(false);
			})
			.catch((err) => apiCatch(err));
	};

	useEffect(() => {
		retry();
	}, []);

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}

		retry();
	}, [time]);

	// eslint-disable-next-line
	const historyData: any = [];
	let i = 0;

	events.historisk.forEach((str) => {
		historyData.push(
			i % 2 === 0 ? (
				<Tooltip
					title={`${time.getFullYear() - parseInt(str)} år siden`}
					placement="top"
					TransitionComponent={Zoom}
					arrow
				>
					<h2 key={makeid(7)} className="noselect">
						{str}
					</h2>
				</Tooltip>
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
				<Tooltip
					title={`${time.getFullYear() - parseInt(str)} år siden`}
					placement="top"
					TransitionComponent={Zoom}
					arrow
				>
					<h2 key={makeid(7)} className="noselect">
						{str}
					</h2>
				</Tooltip>
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
				<Tooltip
					title={`${time.getFullYear() - parseInt(str)} år siden`}
					placement="top"
					TransitionComponent={Zoom}
					arrow
				>
					<h2 key={makeid(7)} className="noselect">
						{str}
					</h2>
				</Tooltip>
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
			<Snackbar
				anchorOrigin={{ horizontal: "center", vertical: "top" }}
				open={retrying}
			>
				<Alert severity="warning">Oops, noe skjedde. Vi fikser feilen!</Alert>
			</Snackbar>

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
