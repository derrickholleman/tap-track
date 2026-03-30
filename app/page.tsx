'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStudents } from '@/lib/use-students';
import { FilterBar } from '@/components/filter-bar';
import { StudentList } from '@/components/student-list';

export default function Home() {
	const { students } = useStudents();
	const [filterQuery, setFilterQuery] = useState('');

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
			<StudentList students={filtered} />
		</main>
	);
}
