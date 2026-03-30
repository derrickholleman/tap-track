'use client';

import { useEffect, useRef } from 'react';

interface DeleteModalProps {
	isOpen: boolean;
	studentName: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export function DeleteModal({ isOpen, studentName, onConfirm, onCancel }: DeleteModalProps) {
	const deleteRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!isOpen) return;

		deleteRef.current?.focus();

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onCancel();
		}

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onCancel]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			onClick={onCancel}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="delete-modal-title"
				className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 id="delete-modal-title" className="text-lg font-semibold text-gray-900">
					Delete Student
				</h2>
				<p className="mt-2 text-gray-600">
					Are you sure you want to delete <strong>{studentName}</strong>? This action cannot be
					undone.
				</p>
				<div className="mt-6 flex justify-end gap-3">
					<button
						onClick={onCancel}
						className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						ref={deleteRef}
						onClick={onConfirm}
						className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
