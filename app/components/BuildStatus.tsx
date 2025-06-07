// app/components/BuildStatus.tsx
'use client';

import React from 'react';

export default function BuildStatus() {
  return (
    <div className="p-4 bg-white text-black rounded shadow text-center">
      <h2 className="font-semibold mb-2">CI Build Status</h2>
      <a
        href="https://github.com/slu-csci-5030/image-recognition-integration-system/actions/workflows/ci.yml"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://github.com/slu-csci-5030/image-recognition-integration-system/actions/workflows/ci.yml/badge.svg"
          alt="CI Build Status"
          className="mx-auto"
        />
      </a>
    </div>
  );
}
