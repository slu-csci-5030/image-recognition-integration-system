// app/components/BurndownChart.tsx
'use client';
import React from 'react';

export default function BurndownChart() {
  return (
    <div className="p-4 bg-white text-black rounded shadow">
      <h2 className="font-semibold mb-2">Sprint Burndown</h2>
      <div className="text-4xl font-bold">60%</div>
      <p className="mt-2 text-sm text-gray-600">
        60% of the tasks are completed in the current sprint.
      </p>
    </div>
  );
}
