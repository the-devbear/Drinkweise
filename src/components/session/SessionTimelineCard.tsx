import { buildTimelineDataFromSession } from '@drinkweise/lib/sessions/build-timeline-data-from-session';
import { Card, CardContent, CardHeader, CardTitle } from '@drinkweise/ui/Card';

import { TimelinePoint } from './SessionTimelinePoint';

interface SessionTimelineCardProps {
  sessionConsumptions: {
    id: number;
    name: string;
    type: string;
    alcohol: number;
    volume: number;
    startTime: string;
    endTime: string;
  }[];
}

export function SessionTimelineCard({ sessionConsumptions }: SessionTimelineCardProps) {
  const timelineData = buildTimelineDataFromSession(sessionConsumptions);
  return (
    <Card className='mx-4'>
      <CardHeader>
        <CardTitle className='font-bold text-gray-600 dark:text-gray-300'>
          Consumption Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timelineData.map((timePoint) => (
          <TimelinePoint key={timePoint.time} time={timePoint.time} drinks={timePoint.drinks} />
        ))}
      </CardContent>
    </Card>
  );
}
