'use client';

import { useState } from 'react';
import { Student, BehaviorType } from './types';
import * as storage from './storage';

export function useStudents() {
	const [students, setStudents] = useState<Student[]>(() => storage.getStudents());

	function refresh() {
		setStudents(storage.getStudents());
	}

	function addStudent(firstName: string, lastName: string): Student {
		const student = storage.addStudent(firstName, lastName);
		refresh();
		return student;
	}

	function reorderStudents(fromIndex: number, toIndex: number) {
		storage.reorderStudents(fromIndex, toIndex);
		refresh();
	}

	function deleteStudent(studentId: string) {
		storage.deleteStudent(studentId);
		refresh();
	}

	function getStudent(studentId: string) {
		return students.find((s) => s.id === studentId);
	}

	function addBehavior(studentId: string, data: { type: BehaviorType; timestamp: number }) {
		const behavior = storage.addBehavior(studentId, data);
		refresh();
		return behavior;
	}

	function updateBehavior(
		studentId: string,
		behaviorId: string,
		data: { type: BehaviorType; timestamp: number }
	) {
		storage.updateBehavior(studentId, behaviorId, data);
		refresh();
	}

	function deleteBehavior(studentId: string, behaviorId: string) {
		storage.deleteBehavior(studentId, behaviorId);
		refresh();
	}

	function importStudents(imported: Student[]) {
		storage.importStudents(imported);
		refresh();
	}

	function exportStudents(): string {
		return storage.exportStudents();
	}

	return {
		students,
		addStudent,
		reorderStudents,
		deleteStudent,
		getStudent,
		addBehavior,
		updateBehavior,
		deleteBehavior,
		importStudents,
		exportStudents,
	};
}
