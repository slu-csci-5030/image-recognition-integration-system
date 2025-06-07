// app/components/TeamWorkload.tsx
"use client";
import React, { useState } from "react";

type Member = {
  name: string;
  emoji: string;
  tasks: number;
  availability: "Available" | "Busy" | "Out";
};

export function TeamWorkload() {
  const [members, setMembers] = useState<Member[]>([
    { name: "Supraja", emoji: "👩‍💻", tasks: 4, availability: "Available" },
    { name: "Obsa", emoji: "👨‍💻", tasks: 5, availability: "Busy" },
    { name: "Chandana", emoji: "👨‍💻", tasks: 3, availability: "Out" },
  ]);

  const handleAvailabilityChange = (index: number, value: Member["availability"]) => {
    const updated = [...members];
    updated[index].availability = value;
    setMembers(updated);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow max-w-xl w-full">
      <h2 className="text-2xl font-semibold mb-6 text-blue-300 text-center">
        Team Workload & Availability
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {members.map((member, idx) => (
          <div
            key={member.name}
            className="bg-gray-700 rounded-xl p-4 shadow-lg text-white space-y-2"
          >
            <div className="flex items-center space-x-2">
              <span className="text-3xl">{member.emoji}</span>
              <span className="text-lg font-semibold">{member.name}</span>
            </div>
            <div className="text-sm">🧠 Tasks: {member.tasks}</div>
            <div className="mt-2">
              <label
                htmlFor={`availability-${idx}`}
                className="block text-sm mb-1 text-gray-300"
              >
                Availability:
              </label>
              <select
                id={`availability-${idx}`}
                className="bg-gray-600 text-white text-sm rounded px-2 py-1 w-full focus:outline-none"
                value={member.availability}
                onChange={(e) =>
                  handleAvailabilityChange(idx, e.target.value as Member["availability"])
                }
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Out">Out</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
