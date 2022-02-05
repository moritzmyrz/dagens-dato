module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				backgroundsecondary: 'var(--background-secondary)',
				text: 'var(--text)',
			},
		},
	},
	plugins: [],
};
