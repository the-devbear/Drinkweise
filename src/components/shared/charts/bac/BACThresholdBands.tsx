import { Line as SKLine, RoundedRect, vec } from '@shopify/react-native-skia';
import React from 'react';
import type { ChartBounds, Scale } from 'victory-native';

interface BACThresholdBandsProps {
  chartBounds: ChartBounds;
  yScale: Scale;
  highRiskThreshold?: number;
  warningThreshold?: number;
}

export function BACThresholdBands({
  chartBounds,
  yScale,
  highRiskThreshold = 0.5,
  warningThreshold = 0.2,
}: BACThresholdBandsProps) {
  const xMinPx = chartBounds.left;
  const xMaxPx = chartBounds.right;
  const chartWidthPx = xMaxPx - xMinPx;
  const yTopPx = chartBounds.top;
  const yBottomPx = chartBounds.bottom;

  const clampY = (y: number) => Math.max(yTopPx, Math.min(yBottomPx, y));

  const yHighRiskPx = clampY(yScale(highRiskThreshold));
  const yWarningPx = clampY(yScale(warningThreshold));

  const redBandY = yTopPx;
  const redBandHeight = Math.max(0, yHighRiskPx - yTopPx);

  const yellowBandY = yHighRiskPx;
  const yellowBandHeight = Math.max(0, yWarningPx - yHighRiskPx);

  return (
    <>
      {redBandHeight > 0 && (
        <RoundedRect
          x={xMinPx}
          y={redBandY}
          width={chartWidthPx}
          height={redBandHeight}
          r={0}
          color='rgba(239, 68, 68, 0.22)'
        />
      )}

      {yellowBandHeight > 0 && (
        <RoundedRect
          x={xMinPx}
          y={yellowBandY}
          width={chartWidthPx}
          height={yellowBandHeight}
          r={0}
          color='rgba(250, 204, 21, 0.20)'
        />
      )}

      {/* Threshold lines */}
      <SKLine
        p1={vec(xMinPx, yHighRiskPx)}
        p2={vec(xMaxPx, yHighRiskPx)}
        color='rgba(239, 68, 68, 0.6)'
        strokeWidth={1}
      />
      <SKLine
        p1={vec(xMinPx, yWarningPx)}
        p2={vec(xMaxPx, yWarningPx)}
        color='rgba(250, 204, 21, 0.6)'
        strokeWidth={1}
      />
    </>
  );
}
