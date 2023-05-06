import { Tooltip } from '@material-ui/core';
import {
	TabPanel,
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
	TimelineItem,
	TimelineOppositeContent,
	TimelineSeparator,
} from '@material-ui/lab';

export interface Root {
	year: string;
	description: string;
	wikipedia: Wikipedum[];
}

export interface Wikipedum {
	title: string;
	wikipedia: string;
}

const TabTimeline: React.VFC<{
	tabValue: string;
	eventArray: any;
	date: Date;
}> = ({ tabValue, eventArray, date }) => {
	return (
		<TabPanel value={tabValue}>
			<Timeline className="text-text">
				{eventArray.reverse().map((o: Root, i: number) => (
					<TimelineItem key={i}>
						<TimelineOppositeContent className="w-[66px] !flex-none">
							<Tooltip
								leaveTouchDelay={3000}
								title={`Ca. ${
									new Date().getFullYear() - parseInt(o.year)
								} år siden`}
								placement="top"
								arrow
								key={i}
							>
								<p className="text-text">{o.year}</p>
							</Tooltip>
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineDot />
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent>
							<p>{o.description}</p>
						</TimelineContent>
					</TimelineItem>
				))}
			</Timeline>
		</TabPanel>
	);
};

export default TabTimeline;
