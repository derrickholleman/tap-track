'use client';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Behavior, BEHAVIOR_TYPES } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const BEHAVIOR_COLORS: Record<string, { bg: string; border: string }> = {
	'Refusing work': { bg: 'rgb(239, 68, 68)', border: 'rgb(220, 38, 38)' },
	'Off task': { bg: 'rgb(234, 179, 8)', border: 'rgb(202, 138, 4)' },
	'Not in assigned space': { bg: 'rgb(59, 130, 246)', border: 'rgb(37, 99, 235)' },
	Interrupting: { bg: 'rgb(168, 85, 247)', border: 'rgb(147, 51, 234)' },
};

interface BehaviorDayChartProps {
	behaviors: Behavior[];
}

export function BehaviorDayChart({ behaviors }: BehaviorDayChartProps) {
	const datasets = BEHAVIOR_TYPES.map((type) => {
		const counts = DAYS.map((_, dayIndex) => {
			// JS getDay(): 0=Sun, 1=Mon ... so Mon-Fri = 1-5
			return behaviors.filter((b) => {
				const day = new Date(b.timestamp).getDay();
				return b.type === type && day === dayIndex + 1;
			}).length;
		});

		return {
			label: type,
			data: counts,
			backgroundColor: BEHAVIOR_COLORS[type].bg,
			borderColor: BEHAVIOR_COLORS[type].border,
			borderWidth: 1,
			borderRadius: 4,
		};
	});

	const activeDatasets = datasets.filter((ds) => ds.data.some((v) => v > 0));

	const data = {
		labels: DAYS,
		datasets: activeDatasets,
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Behaviors by Day of Week',
				font: {
					size: 18,
				},
			},
			legend: {
				position: 'bottom' as const,
			},
		},
		scales: {
			x: {
				stacked: true,
				grid: {
					display: false,
				},
			},
			y: {
				stacked: true,
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
