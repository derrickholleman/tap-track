'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/lib/use-students';
import { useToast } from '@/components/toast';
import { PageHeader } from '@/components/page-header';

export default function CreateStudentPage() {
	const router = useRouter();
	const { addStudent } = useStudents();
	const { showToast } = useToast();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	const isValid = firstName.trim() !== '' && lastName.trim() !== '';

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isValid) return;

		addStudent(firstName.trim(), lastName.trim());
		showToast('Student created successfully');
		router.push('/');
	}

	return (
		<main className="mx-auto max-w-2xl px-4 py-8">
			<PageHeader title="Add Student" backHref="/" backLabel="Home" />

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="first-name" className="mb-1 block text-sm font-medium text-gray-700">
						First Name
					</label>
					<input
						id="first-name"
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label htmlFor="last-name" className="mb-1 block text-sm font-medium text-gray-700">
						Last Name
					</label>
					<input
						id="last-name"
						type="text"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<button
					type="submit"
					disabled={!isValid}
					className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Create
				</button>
			</form>
		</main>
	);
}
