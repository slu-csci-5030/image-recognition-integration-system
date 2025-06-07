"use client";
import React, { useState } from "react";

type Feedback = {
  type: "Positive" | "Suggestion";
  text: string;
};

export function FeedbackBoard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { type: "Positive", text: "Clear UI and fast response time" },
    { type: "Suggestion", text: "Add filtering to image results" },
  ]);

  const [text, setText] = useState("");
  const [type, setType] = useState<Feedback["type"]>("Positive");

  const handleAddFeedback = () => {
    if (text.trim()) {
      setFeedbacks([...feedbacks, { type, text }]);
      setText("");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">📝 Feedback Board</h2>

      {/* Feedback Form */}
      <div className="mb-4 space-y-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Feedback["type"])}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="Positive">👍 Positive</option>
          <option value="Suggestion">🛠️ Suggestion</option>
        </select>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter feedback..."
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <button
          onClick={handleAddFeedback}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white py-2 rounded font-medium"
        >
          ➕ Add Feedback
        </button>
      </div>

      {/* Feedback Display */}
      <ul className="space-y-2 overflow-y-auto max-h-48 text-gray-200">
        {feedbacks.map((fb, idx) => (
          <li key={idx}>
            {fb.type === "Positive" ? "👍" : "🛠️"} {fb.type}: {fb.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
