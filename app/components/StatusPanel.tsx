// app/components/StatusPanel.tsx
'use client';
import React from 'react';

export default function StatusPanel() {
  return (
    <div className="p-4 bg-white text-black rounded shadow">
      <h2 className="font-semibold mb-2">Issue Status</h2>
      <ul className="space-y-1">
        <li>Open: 9</li>
        <li>In Progress: 3</li>
        <li>Closed: 2</li>
      </ul>
      <p className="mt-2 text-sm text-gray-600">
        Current sprint issue breakdown.
      </p>
    </div>
  );
}
