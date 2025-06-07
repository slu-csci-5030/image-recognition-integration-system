'use client';

import React from 'react';
import NavigationBar from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/navigationBar';
import Container from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/Container';
import BurndownChart from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/Burndown';
import StatusPanel from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/StatusPanel';
import TeamHealthGauge from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/TeamHealthGauge';
import BuildStatus from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/BuildStatus';
import WorkDistributionPie from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/WorkDistributionPie';
import IdeasBox from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/IdeasBox';
import TeamMembers from 'C:/Users/Chandana R/PSDproject/image-recognition-integration-system/app/components/TeamMembers';



export default function RadiatorPage() {
  return (
    <Container>
      <NavigationBar current="Radiator" />

      <main className="py-8">
        <h1 className="text-3xl font-bold mb-6">Team Information Radiator</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BurndownChart />
          <StatusPanel />
          <TeamHealthGauge />
          <BuildStatus />
          <WorkDistributionPie />
          <IdeasBox />
        </div>

        {/* Full-width Team Members row */}
        <div className="mt-8">
          <TeamMembers />
        </div>
      </main>
    </Container>
  );
}
