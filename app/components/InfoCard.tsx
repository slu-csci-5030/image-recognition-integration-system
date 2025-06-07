'use client';
import React, { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  value: ReactNode;
  description?: string;
}

export default function InfoCard({ title, value, description }: InfoCardProps) {
  return (
    <div className="p-4 bg-white text-black rounded shadow flex flex-col justify-between">
      <div>
        <h2 className="font-semibold text-lg mb-1">{title}</h2>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
}
