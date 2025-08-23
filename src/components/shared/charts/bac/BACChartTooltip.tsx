import {
  Circle,
  matchFont,
  Line as SKLine,
  vec,
  Text as SkiaText,
  RoundedRect,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

interface BACChartTooltipProps {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  activeBACLevel: SharedValue<number>;
  activeTime: SharedValue<number>;
  chartBounds: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  textColor: string;
  lineColor: string;
  indicatorColor: string;
  backgroundColor: string;
  topOffset?: number;
  fontSize?: number;
  tooltipPadding?: number;
  tooltipCornerRadius?: number;
  tooltipMinDistanceFromEdge?: number;
  tooltipExtraWidth?: number;
  textSpacing?: number;
  indicatorRadius?: number;
  separator?: string;
}

export function BACChartTooltip({
  xPosition,
  yPosition,
  chartBounds: { top, bottom, left, right },
  activeBACLevel,
  activeTime,
  textColor,
  lineColor,
  indicatorColor,
  backgroundColor,
  topOffset = 0,
  fontSize = 11,
  tooltipPadding = 6,
  tooltipCornerRadius = 4,
  tooltipMinDistanceFromEdge = 4,
  tooltipExtraWidth = 12,
  indicatorRadius = 6,
  separator = '|',
}: BACChartTooltipProps) {
  const font = useMemo(
    () =>
      matchFont({
        fontFamily: Platform.select({ ios: 'Helvetica', default: 'serif' }),
        fontSize,
      }),
    [fontSize]
  );

  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() => vec(xPosition.value, top + topOffset));

  const tooltipText = useDerivedValue(() => {
    'worklet';
    const bac = `${activeBACLevel.value.toFixed(2)} ‰`;
    const date = new Date(activeTime.value);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${bac} ${separator} ${time}`;
  });

  const tooltipTextWidth = useDerivedValue(
    () =>
      font?.getGlyphWidths?.(font.getGlyphIDs(tooltipText.value)).reduce((sum, v) => sum + v, 0) ??
      0
  );

  const tooltipWidth = useDerivedValue(
    () => tooltipTextWidth.value + tooltipPadding * 2 + tooltipExtraWidth
  );

  const tooltipHeight = fontSize + tooltipPadding * 2;

  const tooltipX = useDerivedValue(() => {
    'worklet';
    const preferredX = xPosition.value - tooltipWidth.value / 2;
    const minX = left + tooltipMinDistanceFromEdge;
    const maxX = right - tooltipWidth.value - tooltipMinDistanceFromEdge;

    return Math.max(minX, Math.min(maxX, preferredX));
  });

  const tooltipY = top + 8;

  const totalContentWidth = useDerivedValue(() => tooltipTextWidth.value);
  const contentStartX = useDerivedValue(
    () => tooltipX.value + (tooltipWidth.value - totalContentWidth.value) / 2
  );
  const textX = useDerivedValue(() => contentStartX.value);
  const textY = tooltipY + tooltipPadding + fontSize;

  return (
    <>
      <SKLine p1={start} p2={end} color={lineColor} strokeWidth={1} />
      <Circle cx={xPosition} cy={yPosition} r={indicatorRadius} color={indicatorColor} />

      <RoundedRect
        x={tooltipX}
        y={tooltipY}
        width={tooltipWidth}
        height={tooltipHeight}
        r={tooltipCornerRadius}
        color={backgroundColor}
        style='fill'
      />

      <RoundedRect
        x={tooltipX}
        y={tooltipY}
        width={tooltipWidth}
        height={tooltipHeight}
        r={tooltipCornerRadius}
        color={lineColor}
        style='stroke'
        strokeWidth={1}
      />

      <SkiaText color={textColor} font={font} text={tooltipText} x={textX} y={textY} />
    </>
  );
}
