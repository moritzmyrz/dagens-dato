import {
	TabPanel,
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
	TimelineItem,
	TimelineOppositeContent,
	TimelineSeparator,
} from '@mui/lab';
import { Skeleton, Tooltip } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { timeState } from '../state/timeState';

const TabTimeline: React.VFC<{
	tabValue: string;
	eventArray: string[];
}> = ({ tabValue, eventArray }) => {
	const time = useRecoilValue(timeState);

	interface timelineItem {
		date: string;
		description: string;
	}

	const makeTimeline = (events: string[]): timelineItem[] => {
		const timeline: timelineItem[] = [];
		let i = 0;

		for (let i = 0; i < events.length; i += 2) {
			timeline.push({
				date: events[i],
				description: events[i + 1],
			});
		}

		return timeline;
	};

	return (
		<TabPanel value={tabValue}>
			<Timeline className="text-text">
				{makeTimeline(eventArray).map((o: timelineItem, i: number) => (
					<TimelineItem key={i}>
						<TimelineOppositeContent className="flex-none">
							{o.date == 'Loading' ? (
								<EventSkeleton>
									<p>0000</p>
								</EventSkeleton>
							) : (
								<Tooltip
									leaveTouchDelay={3000}
									title={`Ca. ${
										time.getFullYear() - parseInt(o.date)
									} år siden`}
									placement="top"
									arrow
									key={i}
								>
									<p className="text-text">{o.date}</p>
								</Tooltip>
							)}
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineDot />
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent>
							{o.date == 'Loading' ? (
								<EventSkeleton>
									<p>
										Lorem ipsum dolor, sit amet consectetur adipisicing elit.
										Animi.
									</p>
								</EventSkeleton>
							) : (
								<p>{o.description}</p>
							)}
						</TimelineContent>
					</TimelineItem>
				))}
			</Timeline>
		</TabPanel>
	);
};

const EventSkeleton: React.FC = ({ children }) => {
	return (
		<Skeleton
			variant="text"
			// width={`95%`}
			// height={86}
			animation="wave"
		>
			{children}
		</Skeleton>
	);
};

export default TabTimeline;
