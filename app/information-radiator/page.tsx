// /app/information-radiator/page.tsx
'use client';

import React from 'react';
import { TaskMetrics } from '@/app/components/TaskMetrics';
import { TeamWorkload } from '@/app/components/TeamWorkload';
import { TeamAchievements } from '@/app/components/TeamAchievements';
import { FeedbackBoard } from '@/app/components/FeedbackBoard';
import { TeamHealth } from '@/app/components/TeamHealth';
import { TeamGoals } from '@/app/components/TeamGoals';

export default function InformationRadiator() {
  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">
        IRIS Project: Information Radiator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <TeamGoals />
        <TaskMetrics />
        <TeamWorkload />
        <TeamAchievements />
        <FeedbackBoard />
        <TeamHealth />
      </div>
    </main>
  );
}
