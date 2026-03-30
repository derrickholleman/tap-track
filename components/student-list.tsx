import Link from 'next/link';
import { Student } from '@/lib/types';

interface StudentListProps {
	students: Student[];
}

export function StudentList({ students }: StudentListProps) {
	if (students.length === 0) {
		return <p className="text-center text-gray-500">No students found.</p>;
	}

	return (
		<ul className="mx-auto max-w-md space-y-2">
			{students.map((student) => (
				<li key={student.id}>
					<Link
						href={`/${student.id}/profile`}
						className="block rounded-lg border border-gray-200 px-4 py-3 text-blue-600 hover:bg-gray-50 hover:text-blue-800"
					>
						{student.firstName} {student.lastName}
					</Link>
				</li>
			))}
		</ul>
	);
}
