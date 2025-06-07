// /app/components/TeamHealth.tsx
"use client";
import React, { useState } from "react";

export function TeamHealth() {
  const [morale, setMorale] = useState("High");
  const [velocity, setVelocity] = useState(22);
  const [communication, setCommunication] = useState("Effective");

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow max-w-sm">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">Team Health</h2>

      {/* Morale */}
      <label className="block mb-2 text-gray-300 font-medium" htmlFor="morale">
        😀 Morale:
      </label>
      <select
        id="morale"
        value={morale}
        onChange={(e) => setMorale(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-gray-700 text-gray-200"
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      {/* Velocity */}
      <label className="block mb-2 text-gray-300 font-medium" htmlFor="velocity">
        📈 Velocity (points/week):
      </label>
      <input
        type="number"
        id="velocity"
        value={velocity}
        onChange={(e) => setVelocity(Number(e.target.value))}
        min={0}
        className="w-full mb-4 p-2 rounded bg-gray-700 text-gray-200"
      />

      {/* Communication */}
      <label
        className="block mb-2 text-gray-300 font-medium"
        htmlFor="communication"
      >
        💬 Communication:
      </label>
      <select
        id="communication"
        value={communication}
        onChange={(e) => setCommunication(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-gray-200"
      >
        <option>Effective</option>
        <option>Needs Improvement</option>
        <option>Poor</option>
      </select>
    </div>
  );
}
