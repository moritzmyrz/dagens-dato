import { IconButton, Tooltip } from '@mui/material';
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
		<div className="h-screen mx-auto flex flex-col">
			<div className="py-4 flex flex-col space-y-4 justify-center items-center">
				<ButtonBar />
				<div className="bg-backgroundsecondary px-4 py-2 rounded-xl w-[97%] sm:w-[450px]">
					<h2 className="text-xl text-center font-bold">{GetDay(time)} </h2>

					<h1 className="text-3xl text-center font-bold">
						{`${time.getDate()}. ${GetMonth(time.getMonth())}
          ${time.getFullYear()}`}
					</h1>

					<Tooltip
						title={weekDescription(startDateOfWeek, endDateOfWeek)}
						arrow
						leaveTouchDelay={3000}
					>
						<h2 className="text-xl text-center font-semibold text-text">
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
