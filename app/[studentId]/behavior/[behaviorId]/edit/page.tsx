'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/lib/use-students';
import { PageHeader } from '@/components/page-header';
import { BehaviorForm } from '@/components/behavior-form';
import { BehaviorType } from '@/lib/types';

function timestampToDateString(timestamp: number): string {
	const d = new Date(timestamp);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function timestampToTimeString(timestamp: number): string {
	const d = new Date(timestamp);
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
}

export default function EditBehaviorPage({
	params,
}: {
	params: Promise<{ studentId: string; behaviorId: string }>;
}) {
	const { studentId, behaviorId } = use(params);
	const router = useRouter();
	const { getStudent, updateBehavior } = useStudents();

	const student = getStudent(studentId);
	const behavior = student?.behaviors.find((b) => b.id === behaviorId);

	if (!student || !behavior) {
		return (
			<main className="mx-auto max-w-2xl px-4 py-8">
				<PageHeader title="Not Found" backHref="/" backLabel="Home" />
				<p className="text-gray-500">This behavior or student does not exist.</p>
			</main>
		);
	}

	function handleSubmit(data: { type: BehaviorType; timestamp: number }) {
		updateBehavior(studentId, behaviorId, data);
		router.push(`/${studentId}/profile`);
	}

	return (
		<main className="mx-auto max-w-2xl px-4 py-8">
			<PageHeader
				title="Edit Behavior"
				backHref={`/${studentId}/profile`}
				backLabel={`${student.firstName} ${student.lastName}`}
			/>
			<BehaviorForm
				initialValues={{
					type: behavior.type,
					date: timestampToDateString(behavior.timestamp),
					time: timestampToTimeString(behavior.timestamp),
				}}
				onSubmit={handleSubmit}
			/>
		</main>
	);
}
