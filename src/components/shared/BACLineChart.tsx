import type { BACDataPoint } from '@drinkweise/lib/bac/models/bac-data-point.model';
import { cn } from '@drinkweise/lib/cn';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { matchFont } from '@shopify/react-native-skia';
import { Platform, View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';

interface BACLineChartProps {
  className?: string;
  bacDataPoints: BACDataPoint[];
}

export function BACLineChart({ className, bacDataPoints }: BACLineChartProps) {
  const font = matchFont({
    fontFamily: Platform.select({ ios: 'Helvetica Neue', default: 'serif' }),
  });

  if (bacDataPoints.length === 0) {
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
      <CartesianChart
        data={bacDataPoints}
        xKey='time'
        yKeys={['bloodAlcoholContent']}
        xAxis={{ font, formatXLabel: (value) => shortTimeFormatter.format(value) }}
        yAxis={[{ font }]}>
        {({ points }) => <Line points={points.bloodAlcoholContent} />}
      </CartesianChart>
    </View>
  );
}
