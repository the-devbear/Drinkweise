import type { BACDataPoint } from '@drinkweise/lib/bac/models/bac-data-point.model';
import { cn } from '@drinkweise/lib/cn';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { View } from 'react-native';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';

interface BACLineChartProps {
  className?: string;
  bacDataPoints: BACDataPoint[];
}

export function BACLineChart({ className, bacDataPoints }: BACLineChartProps) {
  const chartData: lineDataItem[] = useMemo(
    () =>
      bacDataPoints.map((point) => ({
        value: point.bloodAlcoholContent,
        label: format(point.time, 'HH:mm'),
      })),
    [bacDataPoints]
  );

  if (chartData.length === 0) {
    return (
      <View className={cn('h-[270px] items-center justify-center bg-card', className)}>
        <Ionicons name='analytics' size={64} className='bg-grey' />
        <Text variant='body' className='mt-2 text-center text-muted'>
          No drinks yet
        </Text>
        <Text variant='caption1' className='text-center text-muted'>
          Add your first drink to see your BAC over time.
        </Text>
      </View>
    );
  }

  return (
    <View className={cn('h-[270px] bg-card', className)}>
      <LineChart
        data={chartData}
        height={200}
        isAnimated
        animateOnDataChange
        xAxisLabelsVerticalShift={5}
      />
    </View>
  );
}
