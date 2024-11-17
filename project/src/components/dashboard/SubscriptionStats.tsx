import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SubscriptionStatsProps {
  activeCount: number;
  expiredCount: number;
  expiringCount: number;
}

function SubscriptionStats({ activeCount, expiredCount, expiringCount }: SubscriptionStatsProps) {
  const data = {
    labels: ['نشط', 'منتهي', 'ينتهي قريباً'],
    datasets: [
      {
        data: [activeCount, expiredCount, expiringCount],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',  // green
          'rgba(239, 68, 68, 0.5)',  // red
          'rgba(234, 179, 8, 0.5)',  // yellow
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export default SubscriptionStats;