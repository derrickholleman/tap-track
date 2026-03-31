'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudents } from '@/lib/use-students';
import { useToast } from '@/components/toast';
import { PageHeader } from '@/components/page-header';
import { BehaviorList } from '@/components/behavior-list';
import { DeleteModal } from '@/components/delete-modal';
import { BehaviorBarChart } from '@/components/charts/behavior-bar-chart';
import { BehaviorDayChart } from '@/components/charts/behavior-day-chart';
import { BehaviorTimeChart } from '@/components/charts/behavior-time-chart';

export default function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
	const { studentId } = use(params);
	const router = useRouter();
	const { getStudent, deleteBehavior, deleteStudent } = useStudents();
	const { showToast } = useToast();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [chartFilter, setChartFilter] = useState('all');

	const student = getStudent(studentId);

	if (!student) {
		return (
			<main className="mx-auto w-full max-w-360 px-4 py-8">
				<PageHeader title="Student Not Found" backHref="/" backLabel="Home" />
				<p className="text-gray-500">This student does not exist.</p>
			</main>
		);
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
					className="absolute right-0 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
				>
					Delete Student
				</button>
			</div>

			<section className="mx-auto mb-6 max-w-2xl">
				<div className="mb-6 flex justify-center">
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
					onDelete={(id) => deleteBehavior(studentId, id)}
				/>
			</section>

			{student.behaviors.length > 0 && (
				<section className="mx-auto mb-6 mt-20 max-w-2xl">
					<div className="mb-10 flex items-center justify-between">
						<h2 className="text-2xl font-semibold text-gray-900">Behavior Insights</h2>
						<select
							value={chartFilter}
							onChange={(e) => setChartFilter(e.target.value)}
							className="rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm"
						>
							<option value="all">All Time</option>
							{Array.from(
								new Map(
									[...student.behaviors]
										.sort((a, b) => b.timestamp - a.timestamp)
										.map((b) => {
											const d = new Date(b.timestamp);
											const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
											const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
											return [key, label] as [string, string];
										})
								).entries()
							).map(([key, label]) => (
								<option key={key} value={key}>
									{label}
								</option>
							))}
						</select>
					</div>
					{(() => {
						const filtered =
							chartFilter === 'all'
								? student.behaviors
								: student.behaviors.filter((b) => {
										const d = new Date(b.timestamp);
										const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
										return key === chartFilter;
									});
						return (
							<>
								<BehaviorBarChart behaviors={filtered} />
								<div className="mt-10">
									<BehaviorDayChart behaviors={filtered} />
								</div>
								<div className="mt-10">
									<BehaviorTimeChart behaviors={filtered} />
								</div>
							</>
						);
					})()}
				</section>
			)}

			<DeleteModal
				isOpen={showDeleteModal}
				studentName={`${student.firstName} ${student.lastName}`}
				onConfirm={handleDeleteStudent}
				onCancel={() => setShowDeleteModal(false)}
			/>
		</main>
	);
}
