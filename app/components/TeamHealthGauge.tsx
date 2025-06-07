// app/components/TeamHealthGauge.tsx
'use client';
import React from 'react';

export default function TeamHealthGauge() {
  return (
    <div className="p-4 bg-white text-black rounded shadow">
      <h2 className="font-semibold mb-2">Team Health</h2>
      <div className="text-4xl font-bold text-green-600">Green</div>
      <p className="mt-2 text-sm text-gray-600">
        Overall team well-being status.
      </p>
    </div>
  );
}
