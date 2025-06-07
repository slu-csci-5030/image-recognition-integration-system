'use client';

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function WorkDistributionPie() {
  const labels = ['Obsa', 'Supraja', 'Chandana'];
  const dataPoints = [1, 1, 1];
  const total = dataPoints.reduce((a, b) => a + b, 0);
  const percentages = dataPoints.map(dp => ((dp / total) * 100).toFixed(2));

  // Define distinct colors for each slice
  const backgroundColors = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="p-4 bg-white text-black rounded shadow">
      <h2 className="font-semibold mb-2">Work Distribution</h2>
      <div style={{ height: 200 }}>
        <Pie
          data={{
            labels,
            datasets: [
              {
                data: dataPoints,
                backgroundColor: backgroundColors,
                borderWidth: 1,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: context => {
                    const value = context.parsed;
                    const percent = ((value / total) * 100).toFixed(2);
                    return `${context.label}: ${percent}%`;
                  }
                }
              },
              legend: { position: 'bottom' }
            }
          }}
        />
      </div>
      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
        {labels.map((name, idx) => (
          <li key={name}>
            <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: backgroundColors[idx] }}></span>
            {name}: {percentages[idx]}%
          </li>
        ))}
      </ul>
    </div>
  );
}
