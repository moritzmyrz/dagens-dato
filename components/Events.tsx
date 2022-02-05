import { TabContext } from '@mui/lab';
import { Alert, Skeleton, Snackbar, Tab, Tabs } from '@mui/material';
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
		<div className="bg-backgroundsecondary text-text w-[97%] sm:w-[450px] px-4 py-2 rounded-xl">
			<Snackbar
				anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
				open={retrying}
			>
				<Alert severity="warning">Oops, noe skjedde. Vi fikser feilen!</Alert>
			</Snackbar>

			<h1 className="text-center text-xl font-semibold">Hendelser</h1>
			{events.description == 'Loading' ? (
				<Skeleton variant="text">
					<p>
						5. februar er den 36. dagen i året. Det er 329 dager igjen av året,
						330 i skuddår.
					</p>
				</Skeleton>
			) : (
				<p className="text-center px-4">{events.description}</p>
			)}
			<TabContext value={`${tab}`}>
				<Tabs value={tab} onChange={handleChange} centered>
					<Tab
						className="text-text"
						label="Historisk"
						value="1"
						icon={<MdTimeline className="text-text" />}
					/>
					<Tab
						label="Fødsler"
						className="text-text"
						value="2"
						icon={<MdCake className="text-text" />}
					/>
					<Tab
						label="Dødsfall"
						className="text-text"
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
