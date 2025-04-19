import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import { calculateSessionDuration } from '@drinkweise/lib/drink-session/calculate-session-duration';
import { useEffect, useState } from 'react';

interface SessionDurationTickerProps {
  className?: string;
  startTime: number;
}

export function SessionDurationTicker({ className, startTime }: SessionDurationTickerProps) {
  const [sessionDuration, setSessionDuration] = useState(calculateSessionDuration(startTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(calculateSessionDuration(startTime));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <Text
      className={cn('text-center text-sm', className)}
      style={{ fontVariant: ['tabular-nums'] }}>
      {sessionDuration}
    </Text>
  );
}
