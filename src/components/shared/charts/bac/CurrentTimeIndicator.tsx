import { now } from '@drinkweise/lib/utils/date/now';
import { matchFont, Text, DashPathEffect } from '@shopify/react-native-skia';
import {
  startOfMinute,
  addMinutes,
  differenceInMilliseconds,
  minutesToMilliseconds,
} from 'date-fns';
import { useState, useEffect } from 'react';
import { type ChartBounds, type PointsArray, Line, Scale } from 'victory-native';

interface ChartNowLineProps {
  chartBounds: ChartBounds;
  xScale: Scale;
  color: string;
}

export function CurrentTimeIndicator({ chartBounds, xScale, color }: ChartNowLineProps) {
  const [currentTime, setCurrentTime] = useState(now());

  useEffect(() => {
    const currentDate = new Date();
    const nextMinute = startOfMinute(addMinutes(currentDate, 1));
    const timeUntilNextMinute = differenceInMilliseconds(nextMinute, currentDate);
    let interval: ReturnType<typeof setInterval> | undefined;

    const initialTimeout = setTimeout(() => {
      setCurrentTime(now());
      interval = setInterval(() => setCurrentTime(now()), minutesToMilliseconds(1));
    }, timeUntilNextMinute);

    return () => {
      clearTimeout(initialTimeout);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const font = matchFont({
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: '600',
  });
  const points: PointsArray = [
    { x: xScale(currentTime), y: chartBounds.bottom, xValue: 0, yValue: 0 },
    { x: xScale(currentTime), y: chartBounds.top, xValue: 1, yValue: 0 },
  ];
  const text = 'Now';
  const textWidth = font.measureText(text).width;
  const textHeight = font.measureText(text).height;

  const idealTextX = xScale(currentTime) - textWidth / 2;

  const textX = Math.max(
    chartBounds.left + 5,
    Math.min(idealTextX, chartBounds.right - textWidth - 5)
  );

  return (
    <>
      <Text x={textX} y={chartBounds.top + textHeight} text='Now' font={font} color={color} />
      <Line
        points={points}
        animate={{ type: 'spring' }}
        color={color}
        opacity={0.7}
        strokeWidth={1}>
        <DashPathEffect intervals={[3, 3]} />
      </Line>
    </>
  );
}
