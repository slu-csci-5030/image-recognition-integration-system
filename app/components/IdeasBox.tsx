'use client'
import React from 'react'

export default function IdeasBox() {
  return (
    <div className="p-4 bg-white text-black rounded shadow">
      <h2 className="font-semibold mb-2">Improvement Ideas</h2>
      <textarea
        className="w-full border rounded p-2 text-black"
        placeholder="Share an idea…"
        rows={4}
      />
      <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
        Submit
      </button>
    </div>
  )
}
