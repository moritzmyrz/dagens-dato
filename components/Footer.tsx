import { Link } from '@mui/material';
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
		<div className="bg-backgroundsecondary justify-center flex items-center space-x-1 text-text px-4 py-2 rounded-xl w-[97%] sm:w-[450px]">
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
