'use client';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Behavior, BEHAVIOR_TYPES } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BEHAVIOR_COLORS: Record<string, string> = {
	'Refusing work': 'rgb(239, 68, 68)',
	'Off task': 'rgb(234, 179, 8)',
	'Not in assigned space': 'rgb(59, 130, 246)',
	Interrupting: 'rgb(168, 85, 247)',
};

// Half-hour buckets from 8:30 AM to 3:30 PM
const BUCKETS = Array.from({ length: 15 }, (_, i) => {
	const totalMinutes = 8 * 60 + 30 + i * 30;
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHour = hours > 12 ? hours - 12 : hours;
	return {
		label: `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`,
		startMinutes: totalMinutes,
		endMinutes: totalMinutes + 30,
	};
});

interface BehaviorTimeChartProps {
	behaviors: Behavior[];
}

export function BehaviorTimeChart({ behaviors }: BehaviorTimeChartProps) {
	const datasets = BEHAVIOR_TYPES.map((type) => {
		const counts = BUCKETS.map((bucket) => {
			return behaviors.filter((b) => {
				if (b.type !== type) return false;
				const date = new Date(b.timestamp);
				const mins = date.getHours() * 60 + date.getMinutes();
				// Round to nearest half hour (e.g., 2:14 → 2:00, 2:15 → 2:30)
				const rounded = Math.round(mins / 30) * 30;
				return rounded === bucket.startMinutes;
			}).length;
		});

		return {
			label: type,
			data: counts,
			borderColor: BEHAVIOR_COLORS[type],
			backgroundColor: BEHAVIOR_COLORS[type],
			tension: 0.3,
			pointRadius: 3,
		};
	});

	const data = {
		labels: BUCKETS.map((b) => b.label),
		datasets,
	};

	const options = {
		responsive: true,
		interaction: {
			mode: 'nearest' as const,
			intersect: false,
		},
		plugins: {
			title: {
				display: true,
				text: 'Behaviors by Time of Day',
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

	return <Line data={data} options={options} />;
}
