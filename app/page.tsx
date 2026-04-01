'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useStudents } from '@/lib/use-students';
import { useToast } from '@/components/toast';
import { FilterBar } from '@/components/filter-bar';
import { StudentList } from '@/components/student-list';
import { DeleteModal } from '@/components/delete-modal';
import { Student } from '@/lib/types';
import { ImportModal } from '@/components/import-modal';
import { downloadJson, parseImportFile } from '@/lib/import-export';

export default function Home() {
	const { students, reorderStudents, deleteStudent, importStudents, exportStudents } =
		useStudents();
	const { showToast } = useToast();
	const [filterQuery, setFilterQuery] = useState('');
	const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
	const [showImportConfirm, setShowImportConfirm] = useState(false);
	const [pendingImport, setPendingImport] = useState<Student[] | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const filtered = students.filter((s) =>
		`${s.firstName} ${s.lastName}`.toLowerCase().includes(filterQuery.toLowerCase())
	);

	function handleExport() {
		const now = new Date();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		downloadJson(exportStudents(), `taptrack-data-${month}-${day}.json`);
	}

	async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const parsed = await parseImportFile(file);
			setPendingImport(parsed);
			setShowImportConfirm(true);
		} catch {
			showToast('Invalid file format');
		}
		e.target.value = '';
	}

	function confirmImport() {
		if (pendingImport) {
			importStudents(pendingImport);
			showToast('Data imported successfully');
		}
		setPendingImport(null);
		setShowImportConfirm(false);
	}

	return (
		<main className="mx-auto w-full max-w-360 px-4 py-8">
			<div className="relative mb-6 flex flex-wrap items-center justify-center gap-3">
				<h1 className="w-full text-center text-4xl font-bold text-gray-900">Tap Track</h1>
				<div className="flex gap-2 md:absolute md:right-0">
					<Link
						href="/create"
						className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					>
						Add Student
					</Link>
					<button
						onClick={handleExport}
						className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
					>
						Export
					</button>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
					>
						Import
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept=".json"
						onChange={handleFileSelect}
						className="hidden"
					/>
				</div>
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

			<ImportModal
				isOpen={showImportConfirm}
				onConfirm={confirmImport}
				onCancel={() => setShowImportConfirm(false)}
			/>
		</main>
	);
}
