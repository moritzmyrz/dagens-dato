export const GetDay = (date: Date) => {
	const days = [
		'Søndag',
		'Mandag',
		'Tirsdag',
		'Onsdag',
		'Torsdag',
		'Fredag',
		'Lørdag',
	];
	return days[date.getDay()];
};
