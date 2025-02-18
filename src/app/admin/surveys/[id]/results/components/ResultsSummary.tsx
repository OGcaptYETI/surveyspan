import { useMemo } from 'react';
import { LineChart } from './charts/LineChart';

interface ResultsSummaryProps {
  results: {
    survey: {
      created_at: string;
    };
    responses: Array<{
      created_at: string;
      completed: boolean;
      duration?: number;
      // Add other response properties as needed
    }>;
    questionResults: Record<string, {
      question: string;
      responses: number;
      data: Array<{ label: string; value: number }>;
    }>;
  };
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  const responseTimeline = useMemo(() => {
    const timeline = new Map<string, number>();
    const sortedResponses = [...results.responses].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sortedResponses.forEach((response) => {
      const date = new Date(response.created_at).toLocaleDateString();
      timeline.set(date, (timeline.get(date) || 0) + 1);
    });

    return {
      labels: Array.from(timeline.keys()),
      values: Array.from(timeline.values())
    };
  }, [results.responses]);

  const stats = useMemo(() => {
    const totalResponses = results.responses.length;
    const completionRate = totalResponses > 0 
      ? (results.responses.filter(r => r.completed).length / totalResponses * 100).toFixed(1)
      : 0;
    const averageTimeToComplete = totalResponses > 0
      ? results.responses.reduce((acc, r) => acc + (r.duration || 0), 0) / totalResponses
      : 0;

    return {
      totalResponses,
      completionRate,
      averageTimeToComplete: Math.round(averageTimeToComplete / 60), // Convert to minutes
    };
  }, [results.responses]);

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Responses</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalResponses}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.completionRate}%
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Avg. Time to Complete</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.averageTimeToComplete} min
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Response Timeline</h3>
        <div className="h-[300px]">
          <LineChart
            data={responseTimeline}
            title="Responses Over Time"
          />
        </div>
      </div>
    </div>
  );
}