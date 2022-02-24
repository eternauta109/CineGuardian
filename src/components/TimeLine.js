import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import FormLabel from "@mui/material/FormLabel";

export default function TimeLine({ comments }) {
  console.log("comments in timeline", comments);
  return (
    <div>
      <Timeline position="alternate" id="timetable">
        <FormLabel id="timetable">Historical comments</FormLabel>

        {comments.map((e, key) => {
          return (
            <TimelineItem key={key}>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                in {e.data}, {e.name} wrote: {e.comment}{" "}
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
}
