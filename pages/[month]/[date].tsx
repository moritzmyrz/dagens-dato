const Date = ({ month, date }: any) => {
	return (
		<div>
			{month}, {date}
		</div>
	);
};

export default Date;

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
	return {
		props: {
			month: ctx.params.month,
			date: ctx.params.date,
		},
	};
}
