import { IconButton, Tooltip } from '@material-ui/core';
import { endOfWeek, startOfWeek } from 'date-fns';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useTheme } from 'next-themes';
import Head from 'next/head';
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
		document.title = `${time.getDate()}. ${GetMonth(
			time.getMonth()
		)} | Dagens Dato`;
	}, [time]);

	return (
		<div className="mx-auto flex h-screen flex-col">
			<NextSeo
				title="Dagens Dato"
				description="Hvilken uke er det? Hva skjedde på dagens dato? Her finner du ut ting om dagens dato, med ett sammendrag over hva som har hendt på dagens dato."
				canonical="https://www.dagensdato.no"
				openGraph={{
					type: 'website',
					url: 'https://www.dagensdato.no',
					title: 'Dagens Dato',
					description:
						'Hvilken uke er det? Hva skjedde på dagens dato? Her finner du ut ting om dagens dato, med ett sammendrag over hva som har hendt på dagens dato.',
					site_name: 'Dagens Dato',
					images: [
						{
							url: '/banner.png',
							alt: 'dagens dato',
							height: 1055,
							width: 3000,
						},
					],
				}}
			/>
			<Head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />
			</Head>
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
