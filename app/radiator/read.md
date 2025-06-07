Team Information Radiator

A simple dashboard showing key project metrics for your team, built with Next.js and Tailwind CSS.

1) Features

Sprint Progress: Percentage of completed tasks (e.g., 60%).

Issue Status: Counts of Open, In Progress, and Closed issues.

Team Health: Overall morale status (e.g., Green).

CI Build Status: Live GitHub Actions build badge.

Work Distribution: Percentage share for each member (equal split: 33.33%).

Improvement Ideas: Text box to collect team suggestions.

Team Members: Lists all current team members.

2) File Structure

app/
├─ components/
│  ├─ BurndownChart.tsx
│  ├─ StatusPanel.tsx
│  ├─ TeamHealthGauge.tsx
│  ├─ BuildStatus.tsx
│  ├─ WorkDistributionPie.tsx
│  ├─ IdeasBox.tsx
│  └─ TeamMembers.tsx
│  └─ NavigationBar.tsx
│  └─ Container.tsx
└─ radiator/
   └─ page.tsx      

3) Quick Customization

Sprint Progress: Edit BurndownChart.tsx — replace the hard-coded 60% and description.

Issue Status: Edit StatusPanel.tsx — update the numbers for Open/In Progress/Closed.

Team Health: Edit TeamHealthGauge.tsx — change the status text and color.

CI Build: In BuildStatus.tsx, update the GitHub Actions badge URL if needed.

Work Distribution: Edit WorkDistributionPie.tsx — set each member’s percentage.

Ideas Box: IdeasBox.tsx captures suggestions locally in a list.

Team Members: Update names in TeamMembers.tsx.

4) Running Locally

# Install dependencies
npm install

# Run development server
npm run dev

Visit http://localhost:3000/radiator to view the dashboard.

5) Deployment

Push to GitHub; 