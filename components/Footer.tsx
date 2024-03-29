import { Link } from '@material-ui/core';
import React from 'react';
import { SiCreativecommons } from 'react-icons/si';
import { useRecoilValue } from 'recoil';
import { GetMonth } from '../functions/GetMonth';
import { timeState } from '../state/timeState';

const Footer: React.FC = () => {
	const time = useRecoilValue(timeState);
	const link = `https://no.wikipedia.org/wiki/${time.getDate()}._${GetMonth(
		time.getMonth()
	).toLowerCase()}`;

	return (
		<div className="bg-backgroundsecondary text-text flex w-[97%] items-center justify-center space-x-1 rounded-xl px-4 py-2 sm:w-[500px]">
			<p>
				All informasjon er hentet fra{' '}
				<Link href={link} target="_blank" rel="noopener">
					Wikipedia
				</Link>
			</p>
			<SiCreativecommons />
		</div>
	);
};

export default Footer;
