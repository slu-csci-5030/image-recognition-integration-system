'use client';

import React, { useEffect, useState } from 'react';

type Issue = {
  id: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
};

export function TaskMetrics() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const owner = 'slu-csci-5030';
  const repo = 'image-recognition-integration-system';

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues?state=all`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) throw new Error('GitHub API error');

        const data = await response.json();
        const filteredIssues = data.filter((item: any) => !item.pull_request);

        setIssues(filteredIssues);
      } catch (error) {
        console.error('Error fetching GitHub issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const openIssues = issues.filter((issue) => issue.state === 'open');
  const closedIssues = issues.filter((issue) => issue.state === 'closed');
  const progress = issues.length === 0 ? 0 : Math.round((closedIssues.length / issues.length) * 100);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md min-h-[300px]">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">📊 Task Status</h2>

      {loading ? (
        <p className="text-gray-300">Loading issues...</p>
      ) : (
        <>
          <div className="flex justify-between mb-3 text-sm text-gray-300">
            <span>Open: {openIssues.length}</span>
            <span>Closed: {closedIssues.length}</span>
            <span>Done: {progress}%</span>
          </div>

          <div className="w-full bg-gray-700 h-3 rounded-full mb-4">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-blue-300 max-h-40 overflow-y-auto">
            <div>
              <h3 className="font-semibold text-green-400 mb-2">🟢 Open Issues</h3>
              <ul className="space-y-1">
                {openIssues.map((issue) => (
                  <li key={issue.id}>
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {issue.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-2">✅ Closed Issues</h3>
              <ul className="space-y-1">
                {closedIssues.map((issue) => (
                  <li key={issue.id}>
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline line-through text-gray-400"
                    >
                      {issue.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
