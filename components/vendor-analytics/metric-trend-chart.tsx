"use client"

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeSeriesDataPoint } from '@/lib/dummy-data'; // Assuming this path is correct

interface MetricTrendChartProps {
  data: TimeSeriesDataPoint[];
  metricKey: keyof TimeSeriesDataPoint;
  title: string;
  xAxisKey: keyof TimeSeriesDataPoint;
  yAxisLabel?: string;
  strokeColor?: string;
  yAxisUnit?: string; // e.g., '%' or ' days'
}

export function MetricTrendChart({
  data,
  metricKey,
  title,
  xAxisKey = 'periodLabel',
  yAxisLabel,
  strokeColor = "#8884d8",
  yAxisUnit = ''
}: MetricTrendChartProps) {

  // Custom Tooltip formatter
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formattedValue = typeof value === 'number' ? `${value.toLocaleString()}${yAxisUnit}` : value;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Period
              </span>
              <span className="font-bold text-muted-foreground">
                {label}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {title}
              </span>
              <span className="font-bold" style={{ color: strokeColor }}>
                {formattedValue}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Y-axis tick formatter
  const formatYAxisTick = (tick: any) => {
    if (typeof tick === 'number') {
      return `${tick.toLocaleString()}${yAxisUnit}`;
    }
    return tick;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20, // Adjusted for potentially longer y-axis labels
            left: 10, // Adjusted
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxisTick}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#888888' } } : undefined}
            domain={['auto', 'auto']} // Allow recharts to determine domain, good for varying data
          />
          <Tooltip content={renderTooltip} cursor={{ fill: "transparent" }} />
          {/* <Legend /> // Optional: Add legend if comparing multiple lines later */}
          <Line
            type="monotone"
            dataKey={metricKey}
            stroke={strokeColor}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3, fill: strokeColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 