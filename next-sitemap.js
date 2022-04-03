/** @type {import('next-sitemap').IConfig} */

module.exports = {
	siteUrl: process.env.SITE_URL || 'https://www.dagensdato.no',
	generateRobotsTxt: true,
};
