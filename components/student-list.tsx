'use client';

import Link from 'next/link';
import { Student } from '@/lib/types';
import { useDragReorder } from '@/lib/use-drag-reorder';
import { Grip } from '@/components/icons/grip';

interface StudentListProps {
	students: Student[];
	onReorder?: (fromIndex: number, toIndex: number) => void;
}

export function StudentList({ students, onReorder }: StudentListProps) {
	const { dragIndex, overIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
		useDragReorder(onReorder);

	if (students.length === 0) {
		return <p className="text-center text-gray-500">No students found.</p>;
	}

	return (
		<ul className="mx-auto max-w-md space-y-2">
			{students.map((student, index) => (
				<li
					key={student.id}
					draggable
					onDragStart={() => handleDragStart(index)}
					onDragOver={(e) => handleDragOver(e, index)}
					onDrop={() => handleDrop(index)}
					onDragEnd={handleDragEnd}
					className={`rounded-lg border transition-all ${
						dragIndex === index
							? 'border-blue-400 opacity-50'
							: overIndex === index
								? 'border-blue-400 border-2'
								: 'border-gray-200'
					}`}
				>
					<Link
						href={`/${student.id}/profile`}
						draggable={false}
						className="flex cursor-grab items-center gap-3 px-4 py-3 text-blue-600 hover:bg-gray-50 hover:text-blue-800 active:cursor-grabbing"
					>
						<Grip className="h-4 w-4 text-gray-400" />
						{student.firstName} {student.lastName}
					</Link>
				</li>
			))}
		</ul>
	);
}
