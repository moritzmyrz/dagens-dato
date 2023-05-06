import { Tab, Tabs } from '@material-ui/core';
import { TabContext } from '@material-ui/lab';
import { useState } from 'react';
import { GiHastyGrave } from 'react-icons/gi';
import { MdCake, MdTimeline } from 'react-icons/md';
import TabTimeline from './TabTimeline';

const Events = ({ events, deaths, births, date }: any) => {
	const [tab, setTab] = useState('1');

	const handleChange = (event: any, newTab: any) => {
		setTab(newTab);
	};

	return (
		<div className="bg-backgroundsecondary text-text w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
			<h2 className="text-center text-xl font-semibold">Hendelser</h2>
			<p className="px-4 text-center">{events.description}</p>
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
				<TabTimeline date={date} eventArray={events} tabValue="1" />
				<TabTimeline date={date} eventArray={births} tabValue="2" />
				<TabTimeline date={date} eventArray={deaths} tabValue="3" />
			</TabContext>
		</div>
	);
};

export default Events;
