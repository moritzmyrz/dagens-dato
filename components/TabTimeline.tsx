import { Tooltip } from "@material-ui/core";
import {
  TabPanel,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import { EventData } from "../types";

const TabTimeline: React.FC<{
  tabValue: string;
  eventArray: EventData[];
}> = ({ tabValue, eventArray }) => {
  return (
    <TabPanel value={tabValue}>
      <Timeline className="text-text">
        {eventArray.map((item: EventData, i: number) => (
          <TimelineItem key={i}>
            <TimelineOppositeContent className="w-[66px] !flex-none">
              <Tooltip
                leaveTouchDelay={3000}
                title={
                  !item.year || isNaN(parseInt(item.year))
                    ? "Ukjent dato"
                    : `${
                        new Date().getFullYear() - parseInt(item.year)
                      } år siden`
                }
                placement="top"
                arrow
                key={i}
              >
                <p className="text-text">{item.year || "?"}</p>
              </Tooltip>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <p>{item.description}</p>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </TabPanel>
  );
};

export default TabTimeline;
