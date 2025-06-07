// app/components/TeamMembers.tsx
'use client';

import React from 'react';

export default function TeamMembers() {
  const members = ['Obsa', 'Supraja', 'Chandana'];

  return (
    <div className="p-4 bg-white text-black rounded shadow">
      <h2 className="font-semibold mb-2">Team Members</h2>
      <ul className="list-disc list-inside">
        {members.map((name) => (
          <li key={name} className="py-1">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
