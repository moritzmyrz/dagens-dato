// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import wiki from 'wikijs';
import { splitMulti } from '../../functions/api/SplitMulti';
import { GetMonth } from '../../functions/GetMonth';

type Data = {
	name: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// @ts-ignore
	const date = new Date(req.query.date);
	if (req.method == 'GET') {
		wiki({ apiUrl: 'https://no.wikipedia.org/w/api.php' })
			.page(`${date.getDate()}. ${GetMonth(date.getMonth()).toLowerCase()}`)
			.then(async (page) => {
				const content = await page.content();
				const rawContent = await page.rawContent();
				const summary = await page.summary();

				let description = summary.replace(/\r?\n|\r/g, ' ');

				const splitter = [' - ', ' – ', ' — ', /\d+(\s–\s)/gm];

				const data = {
					historisk: [],
					births: [],
					deaths: [],
					description,
				};

				// @ts-ignore
				let historisk = await content.find(
					(obj: any) => obj.title === 'Historie'
				);
				if (historisk.items != undefined) {
					var norskHistorie = historisk.items
						.find(
							(object: any) => object.title.toLowerCase() === 'norsk historie'
						)
						.content.split('\n');
				} else {
					console.log('Error');
				}
				historisk = historisk.content;
				historisk = historisk.split('\n');
				if (historisk.items != undefined) historisk.push(...norskHistorie);
				historisk.sort(
					(a: string, b: string) =>
						parseInt(a.split(' ')[0]) - parseInt(b.split(' ')[0])
				);

				// @ts-ignore
				let births = await content.find((obj: any) => obj.title === 'Fødsler');
				births = births.content;
				births = births.split('\n');

				// @ts-ignore
				let deaths = await content.find((obj: any) => obj.title === 'Dødsfall');
				deaths = deaths.content;
				deaths = deaths.split('\n');

				var i = 0;
				for (let [i, v] of historisk.reverse().entries()) {
					v = splitMulti(v, splitter);
					// @ts-ignore
					data.historisk.push(...v);
					i++;
				}

				var j = 0;
				for (let [i, v] of births.reverse().entries()) {
					v = splitMulti(v, splitter);
					// @ts-ignore
					data.births.push(...v);
					j++;
				}

				var k = 0;
				for (let [i, v] of deaths.reverse().entries()) {
					v = splitMulti(v, splitter);
					// @ts-ignore
					data.deaths.push(...v);
					k++;
				}

				// @ts-ignore
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(400).send(err);
			});
	}
	res.status(405);
}
