'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Behavior } from '@/lib/types';
import { formatBehaviorDate } from '@/lib/format-date';
import { Pencil } from '@/components/icons/pencil';
import { Trash } from '@/components/icons/trash';

const PAGE_SIZE = 5;

interface BehaviorListProps {
	behaviors: Behavior[];
	studentId: string;
	onDelete: (behaviorId: string) => void;
}

function groupByMonth(behaviors: Behavior[]): { label: string; key: string; items: Behavior[] }[] {
	const sorted = [...behaviors].sort((a, b) => b.timestamp - a.timestamp);
	const groups = new Map<string, Behavior[]>();

	for (const b of sorted) {
		const date = new Date(b.timestamp);
		const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		const existing = groups.get(key);
		if (existing) {
			existing.push(b);
		} else {
			groups.set(key, [b]);
		}
	}

	return Array.from(groups.entries()).map(([key, items]) => {
		const [year, month] = key.split('-');
		const label = new Date(Number(year), Number(month) - 1).toLocaleString('default', {
			month: 'long',
			year: 'numeric',
		});
		return { label, key, items };
	});
}

function MonthGroup({
	label,
	items,
	studentId,
	onDelete,
	defaultOpen,
}: {
	label: string;
	items: Behavior[];
	studentId: string;
	onDelete: (behaviorId: string) => void;
	defaultOpen: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen);
	const [page, setPage] = useState(0);
	const totalPages = Math.ceil(items.length / PAGE_SIZE);
	const paginated = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

	return (
		<div className="rounded-lg border border-gray-200">
			<button
				onClick={() => setOpen((o) => !o)}
				className="flex w-full items-center justify-between px-4 py-3 text-left"
			>
				<span className="font-medium text-gray-900">
					{label} ({items.length})
				</span>
				<span className="flex h-6 w-6 items-center justify-center rounded text-lg text-gray-500">
					{open ? '−' : '+'}
				</span>
			</button>

			{open && (
				<div className="border-t border-gray-200 px-4 pb-4 pt-3">
					<ul className="space-y-3">
						{paginated.map((behavior) => (
							<li
								key={behavior.id}
								className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
							>
								<div>
									<p className="font-medium text-gray-900">{behavior.type}</p>
									<p className="text-sm text-gray-500">{formatBehaviorDate(behavior.timestamp)}</p>
								</div>
								<div className="flex gap-2">
									<Link
										href={`/${studentId}/behavior/${behavior.id}/edit`}
										aria-label={`Edit ${behavior.type} behavior`}
										className="rounded p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
									>
										<Pencil className="h-5 w-5" />
									</Link>
									<button
										onClick={() => onDelete(behavior.id)}
										aria-label={`Delete ${behavior.type} behavior`}
										className="rounded p-2 text-red-600 hover:bg-red-100 hover:text-red-800"
									>
										<Trash className="h-5 w-5" />
									</button>
								</div>
							</li>
						))}
					</ul>

					{totalPages > 1 && (
						<div className="mt-4 flex items-center justify-center gap-4">
							<button
								onClick={() => setPage((p) => p - 1)}
								disabled={page === 0}
								className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Previous
							</button>
							<span className="text-sm text-gray-600">
								{page + 1} of {totalPages}
							</span>
							<button
								onClick={() => setPage((p) => p + 1)}
								disabled={page === totalPages - 1}
								className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Next
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export function BehaviorList({ behaviors, studentId, onDelete }: BehaviorListProps) {
	if (behaviors.length === 0) {
		return <p className="text-center text-gray-500">No behaviors recorded yet.</p>;
	}

	const groups = groupByMonth(behaviors);

	return (
		<div className="grid grid-cols-2 items-start gap-3">
			{groups.map((group) => (
				<MonthGroup
					key={group.key}
					label={group.label}
					items={group.items}
					studentId={studentId}
					onDelete={onDelete}
					defaultOpen={false}
				/>
			))}
		</div>
	);
}
