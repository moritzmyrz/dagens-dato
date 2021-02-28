import { Link } from "@material-ui/core";
import { GetMonth } from "functions/GetMonth";
import React from "react";
import { SiCreativecommons } from "react-icons/si";
import "style/Footer.scss";

type AppProps = {
	time: Date;
};

const Footer: React.FC<AppProps> = ({ time }: AppProps) => {
	const link = `https://no.wikipedia.org/wiki/${time.getDate()}._${GetMonth(
		time.getMonth()
	).toLowerCase()}`;

	return (
		<div className="footer">
			<p>
				All informasjon er hentet fra{" "}
				<Link href={link} target="_blank" rel="noopener">
					Wikipedia
				</Link>{" "}
				<SiCreativecommons />
			</p>
		</div>
	);
};

export default Footer;
