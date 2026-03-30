'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStudents } from '@/lib/use-students';
import { useToast } from '@/components/toast';
import { FilterBar } from '@/components/filter-bar';
import { StudentList } from '@/components/student-list';
import { DeleteModal } from '@/components/delete-modal';

export default function Home() {
	const { students, reorderStudents, deleteStudent } = useStudents();
	const { showToast } = useToast();
	const [filterQuery, setFilterQuery] = useState('');
	const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

	const filtered = students.filter((s) =>
		`${s.firstName} ${s.lastName}`.toLowerCase().includes(filterQuery.toLowerCase())
	);

	return (
		<main className="mx-auto w-full max-w-360 px-4 py-8">
			<div className="relative mb-6 flex items-center">
				<h1 className="w-full text-center text-4xl font-bold text-gray-900">Tap Track</h1>
				<Link
					href="/create"
					className="absolute right-0 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					Add Student
				</Link>
			</div>

			<FilterBar value={filterQuery} onChange={setFilterQuery} />
			<StudentList
				students={filtered}
				onReorder={reorderStudents}
				onDelete={(id, name) => setDeleteTarget({ id, name })}
			/>

			<DeleteModal
				isOpen={deleteTarget !== null}
				studentName={deleteTarget?.name ?? ''}
				onConfirm={() => {
					if (deleteTarget) {
						deleteStudent(deleteTarget.id);
						showToast('Student deleted successfully');
					}
					setDeleteTarget(null);
				}}
				onCancel={() => setDeleteTarget(null)}
			/>
		</main>
	);
}
