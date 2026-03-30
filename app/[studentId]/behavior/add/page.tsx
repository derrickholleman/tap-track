'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/lib/use-students';
import { PageHeader } from '@/components/page-header';
import { BehaviorForm } from '@/components/behavior-form';
import { BehaviorType } from '@/lib/types';

export default function AddBehaviorPage({ params }: { params: Promise<{ studentId: string }> }) {
	const { studentId } = use(params);
	const router = useRouter();
	const { addBehavior, getStudent } = useStudents();

	const student = getStudent(studentId);

	if (!student) {
		return (
			<main className="mx-auto max-w-2xl px-4 py-8">
				<PageHeader title="Student Not Found" backHref="/" backLabel="Home" />
				<p className="text-gray-500">This student does not exist.</p>
			</main>
		);
	}

	function handleSubmit(data: { type: BehaviorType; timestamp: number }) {
		addBehavior(studentId, data);
		router.push(`/${studentId}/profile`);
	}

	return (
		<main className="mx-auto max-w-2xl px-4 py-8">
			<PageHeader
				title="Add Behavior"
				backHref={`/${studentId}/profile`}
				backLabel={`${student.firstName} ${student.lastName}`}
			/>
			<BehaviorForm onSubmit={handleSubmit} />
		</main>
	);
}
