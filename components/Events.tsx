import { Snackbar, Tab, Tabs } from '@material-ui/core';
import { Alert, Skeleton, TabContext } from '@material-ui/lab';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { GiHastyGrave } from 'react-icons/gi';
import { MdCake, MdTimeline } from 'react-icons/md';
import { useRecoilValue } from 'recoil';
import { timeState } from '../state/timeState';
import TabTimeline from './TabTimeline';

const Events: React.VFC = () => {
	const time = useRecoilValue(timeState);

	const api = `/api/${new Date(time.getTime() + 60 * 60 * 1000).toUTCString()}`;

	const defaultEvents = {
		historisk: ['Loading'],
		births: ['Loading'],
		deaths: ['Loading'],
		description: 'Loading',
	};

	const [tab, setTab] = useState('1');
	const [events, setEvents] = useState(defaultEvents);
	const [retrying, setRetrying] = useState(false);
	const firstUpdate = useRef(true);

	const handleChange = (event: any, newTab: any) => {
		setTab(newTab);
	};

	function apiCatch(err: any) {
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
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				setEvents(response.data);
				setRetrying(false);
				console.log(response.data);
			})
			.catch((err) => apiCatch(err));
	};

	useEffect(retry, []);

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}

		retry();
	}, [time]);

	return (
		<div className="bg-backgroundsecondary text-text w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
			<Snackbar
				anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
				open={retrying}
			>
				<Alert severity="warning">Oops, noe skjedde. Vi fikser feilen!</Alert>
			</Snackbar>

			<h2 className="text-center text-xl font-semibold">Hendelser</h2>
			{events.description == 'Loading' ? (
				<Skeleton variant="text">
					<p>
						5. februar er den 36. dagen i året. Det er 329 dager igjen av året,
						330 i skuddår.
					</p>
				</Skeleton>
			) : (
				<p className="px-4 text-center">{events.description}</p>
			)}
			<TabContext value={`${tab}`}>
				<Tabs variant="standard" centered value={tab} onChange={handleChange}>
					<Tab
						className="text-text"
						style={{ flexShrink: 1 }}
						label="Historisk"
						value="1"
						icon={<MdTimeline className="text-text" />}
					/>
					<Tab
						className="text-text"
						style={{ flexShrink: 1 }}
						label="Fødsler"
						value="2"
						icon={<MdCake className="text-text" />}
					/>
					<Tab
						className="text-text"
						style={{ flexShrink: 1 }}
						label="Dødsfall"
						value="3"
						icon={<GiHastyGrave className="text-text" />}
					/>
				</Tabs>
				<TabTimeline eventArray={events.historisk} tabValue="1" />
				<TabTimeline eventArray={events.births} tabValue="2" />
				<TabTimeline eventArray={events.deaths} tabValue="3" />
			</TabContext>
		</div>
	);
};

export default Events;
