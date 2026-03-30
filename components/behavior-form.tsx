'use client';

import { useState } from 'react';
import { BEHAVIOR_TYPES, BehaviorType } from '@/lib/types';

interface BehaviorFormProps {
	initialValues?: {
		type: BehaviorType;
		date: string;
		time: string;
	};
	onSubmit: (data: { type: BehaviorType; timestamp: number }) => void;
	submitLabel?: string;
}

function getTodayString(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function BehaviorForm({
	initialValues,
	onSubmit,
	submitLabel = 'Apply',
}: BehaviorFormProps) {
	const [type, setType] = useState<BehaviorType | ''>(initialValues?.type ?? '');
	const [date, setDate] = useState(initialValues?.date ?? getTodayString());
	const [time, setTime] = useState(initialValues?.time ?? '');

	const isValid = type !== '' && date !== '' && time !== '';

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isValid) return;

		const timestamp = new Date(`${date}T${time}`).getTime();
		onSubmit({ type: type as BehaviorType, timestamp });
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="behavior-type" className="mb-1 block text-sm font-medium text-gray-700">
					Behavior
				</label>
				<select
					id="behavior-type"
					value={type}
					onChange={(e) => setType(e.target.value as BehaviorType)}
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="" disabled>
						Select a behavior
					</option>
					{BEHAVIOR_TYPES.map((b) => (
						<option key={b} value={b}>
							{b}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="behavior-date" className="mb-1 block text-sm font-medium text-gray-700">
					Date
				</label>
				<input
					id="behavior-date"
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div>
				<label htmlFor="behavior-time" className="mb-1 block text-sm font-medium text-gray-700">
					Time
				</label>
				<input
					id="behavior-time"
					type="time"
					value={time}
					onChange={(e) => setTime(e.target.value)}
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<button
				type="submit"
				disabled={!isValid}
				className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{submitLabel}
			</button>
		</form>
	);
}
