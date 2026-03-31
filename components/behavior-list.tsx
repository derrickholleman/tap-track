import Link from 'next/link';
import { Behavior } from '@/lib/types';
import { formatBehaviorDate } from '@/lib/format-date';
import { Pencil } from '@/components/icons/pencil';
import { Trash } from '@/components/icons/trash';

interface BehaviorListProps {
	behaviors: Behavior[];
	studentId: string;
	onDelete: (behaviorId: string) => void;
}

export function BehaviorList({ behaviors, studentId, onDelete }: BehaviorListProps) {
	const sorted = [...behaviors].sort((a, b) => b.timestamp - a.timestamp);

	if (sorted.length === 0) {
		return <p className="text-center text-gray-500">No behaviors recorded yet.</p>;
	}

	return (
		<ul className="mx-auto max-w-sm space-y-3">
			{sorted.map((behavior) => (
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
	);
}
