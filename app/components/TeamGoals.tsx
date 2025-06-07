"use client";
import React from "react";

export function TeamGoals() {
  const goals = [
    { title: "Complete RERUM integration", description: "Ensure full CRUD support and MongoDB persistence." },
    { title: "Improve model performance", description: "Tune ML models used for image recognition accuracy." },
    { title: "Deploy IRIS demo", description: "Finalize Docker and deployment pipeline by June 10." },
    { title: "Increase test coverage", description: "Reach 90% unit and integration test coverage." },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow max-w-2xl w-full h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-green-300 mb-4">🎯 Team Goals & Objectives</h2>
      <ul className="space-y-4">
        {goals.map((goal, idx) => (
          <li key={idx} className="bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-1">{goal.title}</h3>
            <p className="text-sm text-gray-300">{goal.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
