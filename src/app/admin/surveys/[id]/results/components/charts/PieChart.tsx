'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  data: Record<string, number>;
}

export function PieChart({ data }: PieChartProps) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',   // red
          'rgba(59, 130, 246, 0.5)',  // blue
          'rgba(16, 185, 129, 0.5)',  // green
          'rgba(245, 158, 11, 0.5)',  // yellow
          'rgba(139, 92, 246, 0.5)',  // purple
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <Pie
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'right' as const,
            labels: {
              boxWidth: 20,
              padding: 15
            }
          }
        }
      }}
    />
  );
}