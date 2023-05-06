import { IconButton, Tooltip } from '@material-ui/core';
import { endOfWeek, startOfWeek } from 'date-fns';
import { NextSeo } from 'next-seo';
import { useTheme } from 'next-themes';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import ButtonBar from '../../components/ButtonBar';
import Events from '../../components/Events';
import Footer from '../../components/Footer';
import { GetWeekNum } from '../../functions/GetWeekNum';
import { weekDescription } from '../../functions/WeekDesc';

const DatePage = ({ events, deaths, births, date, month }: any) => {
	const { setTheme, theme } = useTheme();
	const DateObj = new Date(`2020-${month}-${date}`);

	const startDateOfWeek = startOfWeek(DateObj, { weekStartsOn: 1 });
	const endDateOfWeek = endOfWeek(DateObj, { weekStartsOn: 1 });

	const longform = DateObj.toLocaleDateString('nb-NO', {
		month: 'long',
		day: 'numeric',
	});

	return (
		<div className="mx-auto flex h-screen flex-col">
			<NextSeo
				title={`${longform} - Dagens Dato`}
				description={`Hvilken uke er det? Hva skjedde på ${longform}? Her finner du ut hva som skjedde på ${longform}, med ett sammendrag over hva som har hendt på dagen.`}
				canonical="https://www.dagensdato.no"
				openGraph={{
					type: 'website',
					url: `https://www.dagensdato.no/${month}/${date}`,
					title: `${longform} - Dagens Dato`,
					description: `Hvilken uke er det? Hva skjedde på ${longform}? Her finner du ut hva som skjedde på ${longform}, med ett sammendrag over hva som har hendt på dagen.`,
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
			<div className="flex flex-col items-center justify-center space-y-4 py-4">
				<ButtonBar date={DateObj} />
				<div className="bg-backgroundsecondary w-[97%] rounded-xl px-4 py-2 sm:w-[500px]">
					<h1 className="text-center text-3xl font-bold">{longform}</h1>
					<Tooltip
						title={weekDescription(startDateOfWeek, endDateOfWeek)}
						arrow
						leaveTouchDelay={3000}
					>
						<h2 className="text-text text-center text-xl font-semibold">
							Uke {GetWeekNum(DateObj)}
						</h2>
					</Tooltip>
				</div>
				<Events
					events={events.events}
					deaths={deaths.deaths}
					births={births.births}
					date={DateObj}
				/>
				<Footer date={DateObj} />
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

export default DatePage;

const monthsDays = {
	1: 31,
	2: 29,
	3: 31,
	4: 30,
	5: 31,
	6: 30,
	7: 31,
	8: 31,
	9: 30,
	10: 31,
	11: 30,
	12: 31,
};

export async function getStaticPaths() {
	const months = Object.keys(monthsDays);
	const dates = [];

	for (let i = 0; i < months.length; i++) {
		const month = months[i];
		// @ts-ignore
		const days = monthsDays[month];

		for (let j = 1; j <= days; j++) {
			const date = `/${month}/${j}`;
			dates.push(date);
		}
	}

	return {
		paths: dates,
		fallback: false,
	};
}

export async function getStaticProps(ctx: any) {
	const { month, date } = ctx.params;

	const eventsReq = await fetch(
		`https://byabbe.se/on-this-day/${month}/${date}/events.json`
	);
	const events = await eventsReq.json();

	const deathsReq = await fetch(
		`https://byabbe.se/on-this-day/${month}/${date}/deaths.json`
	);
	const deaths = await deathsReq.json();

	const birthsReq = await fetch(
		`https://byabbe.se/on-this-day/${month}/${date}/births.json`
	);
	const births = await birthsReq.json();

	return {
		props: {
			events,
			deaths,
			births,
			date,
			month,
		},
	};
}
