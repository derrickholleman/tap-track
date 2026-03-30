'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudents } from '@/lib/use-students';
import { useToast } from '@/components/toast';
import { PageHeader } from '@/components/page-header';
import { BehaviorList } from '@/components/behavior-list';
import { DeleteModal } from '@/components/delete-modal';

export default function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
	const { studentId } = use(params);
	const router = useRouter();
	const { getStudent, deleteBehavior, deleteStudent } = useStudents();
	const { showToast } = useToast();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const student = getStudent(studentId);

	if (!student) {
		return (
			<main className="mx-auto w-full max-w-360 px-4 py-8">
				<PageHeader title="Student Not Found" backHref="/" backLabel="Home" />
				<p className="text-gray-500">This student does not exist.</p>
			</main>
		);
	}

	function handleDeleteBehavior(behaviorId: string) {
		deleteBehavior(studentId, behaviorId);
	}

	function handleDeleteStudent() {
		deleteStudent(studentId);
		showToast('Student deleted successfully');
		router.push('/');
	}

	return (
		<main className="mx-auto w-full max-w-360 px-4 py-8">
			<div className="relative mb-6 flex items-center">
				<div className="w-full text-center">
					<PageHeader
						title={`${student.firstName} ${student.lastName}`}
						backHref="/"
						backLabel="Home"
					/>
				</div>
				<button
					onClick={() => setShowDeleteModal(true)}
					className="absolute right-0 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
				>
					Delete Student
				</button>
			</div>

			<section className="mx-auto mb-6 max-w-2xl">
				<div className="mb-2 flex justify-center">
					<Link
						href={`/${studentId}/behavior/add`}
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
					>
						Add Behavior
					</Link>
				</div>

				<BehaviorList
					behaviors={student.behaviors}
					studentId={studentId}
					onDelete={handleDeleteBehavior}
				/>
			</section>

			<DeleteModal
				isOpen={showDeleteModal}
				studentName={`${student.firstName} ${student.lastName}`}
				onConfirm={handleDeleteStudent}
				onCancel={() => setShowDeleteModal(false)}
			/>
		</main>
	);
}
