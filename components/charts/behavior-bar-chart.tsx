'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Behavior, BEHAVIOR_TYPES } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const BEHAVIOR_COLORS: Record<string, { bg: string; border: string }> = {
	'Refusing work': { bg: 'rgb(239, 68, 68)', border: 'rgb(220, 38, 38)' },
	'Off task': { bg: 'rgb(234, 179, 8)', border: 'rgb(202, 138, 4)' },
	'Not in assigned space': { bg: 'rgb(59, 130, 246)', border: 'rgb(37, 99, 235)' },
	Interrupting: { bg: 'rgb(168, 85, 247)', border: 'rgb(147, 51, 234)' },
};

interface BehaviorBarChartProps {
	behaviors: Behavior[];
}

export function BehaviorBarChart({ behaviors }: BehaviorBarChartProps) {
	const counts = BEHAVIOR_TYPES.map((type) => behaviors.filter((b) => b.type === type).length);

	const data = {
		labels: BEHAVIOR_TYPES as unknown as string[],
		datasets: [
			{
				data: counts,
				backgroundColor: BEHAVIOR_TYPES.map((type) => BEHAVIOR_COLORS[type].bg),
				borderColor: BEHAVIOR_TYPES.map((type) => BEHAVIOR_COLORS[type].border),
				borderWidth: 1,
				borderRadius: 4,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: 'Behavior Frequency',
				font: {
					size: 18,
				},
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Occurrences',
				},
				ticks: {
					stepSize: 1,
				},
			},
		},
	};

	return <Bar data={data} options={options} />;
}
