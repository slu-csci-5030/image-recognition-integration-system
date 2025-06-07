// app/components/TeamAchievements.tsx
"use client";
import React, { useState } from "react";

type Achievement = {
  title: string;
  contributor: string;
};

export function TeamAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [contributor, setContributor] = useState("");

  const addAchievement = () => {
    if (title.trim() && contributor.trim()) {
      setAchievements([...achievements, { title, contributor }]);
      setTitle("");
      setContributor("");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow max-w-2xl w-full h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-yellow-300 mb-4">
        🏆 Team Achievements & Celebrations
      </h2>
      <div className="space-y-2 mb-6">
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          placeholder="Achievement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          placeholder="Contributor name"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
        />
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded w-full font-medium"
          onClick={addAchievement}
        >
          🎉 Add Achievement
        </button>
      </div>
      <ul className="space-y-4 max-h-64 overflow-y-auto">
        {achievements.map((item, idx) => (
          <li
            key={idx}
            className="bg-gray-700 p-4 rounded-lg shadow-md text-white"
          >
            <p className="text-md font-bold">🏅 {item.title}</p>
            <p className="text-sm text-gray-300">By: {item.contributor}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
