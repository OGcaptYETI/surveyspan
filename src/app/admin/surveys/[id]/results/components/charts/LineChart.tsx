'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title?: string;
}

export function LineChart({ data, title }: LineChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title || 'Responses over time',
        data: data.values,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index' as const
        },
        plugins: {
          legend: {
            position: 'top' as const
          },
          title: {
            display: !!title,
            text: title
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }}
    />
  );
}