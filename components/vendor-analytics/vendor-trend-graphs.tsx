"use client"

import React from 'react';
import { allVendors } from '@/lib/dummy-data'; // Assuming this path is correct
import { MetricTrendChart } from './metric-trend-chart';
import { TimeSeriesDataPoint } from '@/lib/dummy-data'; // Import the interface

interface VendorTrendGraphsProps {
  selectedVendor: string; // Name of the selected vendor
  selectedPeriod: string; // e.g., "7days", "30days", "90days", "1year"
}

// Helper function to get start date based on period
const getStartDate = (period: string): Date => {
  const now = new Date();
  switch (period) {
    case '7days':
      return new Date(now.setDate(now.getDate() - 7));
    case '30days':
      return new Date(now.setMonth(now.getMonth() - 1));
    case '90days':
      return new Date(now.setMonth(now.getMonth() - 3));
    case '1year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default: // Default to 30 days if period is unrecognized
      return new Date(now.setMonth(now.getMonth() - 1));
  }
};

export function VendorTrendGraphs({ selectedVendor, selectedPeriod }: VendorTrendGraphsProps) {
  const vendor = allVendors.find(v => v.name === selectedVendor);

  if (!vendor || !vendor.timeSeriesData || vendor.timeSeriesData.length === 0) {
    return null;
  }

  // Filter the time series data based on the selected period
  const startDate = getStartDate(selectedPeriod);
  const filteredTimeSeriesData = vendor.timeSeriesData.filter(dataPoint => {
    // Ensure dataPoint.date is a valid Date object before comparing
    // The dummy data generation creates Date objects, but good practice to check
    const pointDate = dataPoint.date instanceof Date ? dataPoint.date : new Date(dataPoint.date);
    return !isNaN(pointDate.getTime()) && pointDate >= startDate;
  });

  // If no data remains after filtering, don't render charts
  if (filteredTimeSeriesData.length === 0) {
    // Optionally, render a message indicating no data for the period
    return (
       <div className="mt-8 mb-6 text-center text-gray-500">
         No trend data available for {selectedVendor} in the selected period.
       </div>
    );
  }

  // Define which metrics to display and their configurations
  const metricsToShow = [
    { key: 'passRate', title: 'Pass Rate Trend', color: '#4CAF50', unit: '%' },
    { key: 'volume', title: 'Interview Volume Trend', color: '#2196F3' },
    { key: 'placements', title: 'Placements Trend', color: '#FF9800' },
    { key: 'timeInProcess', title: 'Time in Process Trend', color: '#9C27B0', unit: ' days' },
    { key: 'noShows', title: 'No Show Rate Trend', color: '#F44336', unit: '%' },
    { key: 'integrityFlag', title: 'Integrity Flag Rate Trend', color: '#795548', unit: '%' },
    // { key: 'interviewsPerPlacement', title: 'Interviews per Placement Trend', color: '#607D8B' }, // Can add more
  ];

  return (
    <div className="mt-8 mb-6">
      <h2
        className="mb-4 text-xl font-semibold text-gray-800"
        style={{
            fontFamily: '"Work Sans", sans-serif',
        }}
      >
        Trends for {selectedVendor}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metricsToShow.map(metric => (
          <MetricTrendChart
            key={metric.key}
            data={filteredTimeSeriesData}
            metricKey={metric.key as keyof TimeSeriesDataPoint}
            title={metric.title}
            xAxisKey="periodLabel"
            strokeColor={metric.color}
            yAxisUnit={metric.unit}
          />
        ))}
      </div>
    </div>
  );
} 