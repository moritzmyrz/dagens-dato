import { IconButton, Tooltip } from '@material-ui/core';
import { endOfWeek, startOfWeek } from 'date-fns';
import type { NextPage } from 'next';
import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useRecoilValue } from 'recoil';
import ButtonBar from '../components/ButtonBar';
import Events from '../components/Events';
import Footer from '../components/Footer';
import { GetDay } from '../functions/GetDay';
import { GetMonth } from '../functions/GetMonth';
import { GetWeekNum } from '../functions/GetWeekNum';
import { weekDescription } from '../functions/WeekDesc';
import { timeState } from '../state/timeState';

const Home: NextPage = () => {
	const { setTheme, theme } = useTheme();

	const time = useRecoilValue(timeState);
	const startDateOfWeek = startOfWeek(time, { weekStartsOn: 1 });
	const endDateOfWeek = endOfWeek(time, { weekStartsOn: 1 });

	useEffect(() => {
		document.title = `${time.getDate()}. ${GetMonth(time.getMonth())}`;
	}, [time]);

	return (
		<div className="mx-auto flex h-screen flex-col">
			<div className="flex flex-col items-center justify-center space-y-4 py-4">
				<ButtonBar />
				<div className="bg-backgroundsecondary w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
					<h2 className="text-center text-xl font-bold">{GetDay(time)} </h2>

					<h1 className="text-center text-3xl font-bold">
						{`${time.getDate()}. ${GetMonth(time.getMonth())}
          ${time.getFullYear()}`}
					</h1>

					<Tooltip
						title={weekDescription(startDateOfWeek, endDateOfWeek)}
						arrow
						leaveTouchDelay={3000}
					>
						<h2 className="text-text text-center text-xl font-semibold">
							Uke {GetWeekNum(time)}
						</h2>
					</Tooltip>
				</div>
				<Events />
				<Footer />
				<IconButton
					color="inherit"
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				>
					{theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
				</IconButton>
			</div>
		</div>
	);
};

export default Home;
