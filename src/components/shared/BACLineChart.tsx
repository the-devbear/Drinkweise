import type { BACDataPoint } from '@drinkweise/lib/bac/models/bac-data-point.model';
import { cn } from '@drinkweise/lib/cn';
import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Circle, DashPathEffect, matchFont } from '@shopify/react-native-skia';
import { Platform, View } from 'react-native';
import { CartesianChart, Line, useChartPressState } from 'victory-native';

interface BACLineChartProps {
  className?: string;
  bacDataPoints: BACDataPoint[];
}

export function BACLineChart({ className, bacDataPoints }: BACLineChartProps) {
  const { state, isActive } = useChartPressState({ x: 0, y: { bloodAlcoholContent: 0 } });
  const { colors } = useColorScheme();
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
        padding={{ left: 10 }}
        domainPadding={{ left: 20, bottom: 5, top: 10, right: 10 }}
        chartPressState={state}
        xAxis={{
          labelColor: colors.foreground,
          font,
          lineWidth: 0,
          formatXLabel: (value) => shortTimeFormatter.format(value),
        }}
        yAxis={[
          {
            labelColor: colors.foreground,
            lineColor: colors.grey,
            formatYLabel: (value) => `${value.toFixed(2)} ‰`,
            linePathEffect: <DashPathEffect intervals={[4, 8]} />,
            font,
          },
        ]}>
        {({ points }) => (
          <>
            <Line points={points.bloodAlcoholContent} color={colors.foreground} strokeWidth={2} />
            {isActive && (
              <>
                <Circle
                  cx={state.x.position}
                  cy={state.y.bloodAlcoholContent.position}
                  r={4}
                  color={colors.primary}
                />
              </>
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
