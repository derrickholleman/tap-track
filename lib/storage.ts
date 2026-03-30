import { Student, Behavior, BehaviorType } from './types';

const STORAGE_KEY = 'taptrack_students';

export function getStudents(): Student[] {
	if (typeof window === 'undefined') return [];
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as Student[];
	} catch {
		return [];
	}
}

function setStudents(students: Student[]): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export function getStudent(studentId: string): Student | undefined {
	return getStudents().find((s) => s.id === studentId);
}

export function addStudent(firstName: string, lastName: string): Student {
	const student: Student = {
		id: crypto.randomUUID(),
		firstName,
		lastName,
		behaviors: [],
	};
	const students = getStudents();
	students.push(student);
	setStudents(students);
	return student;
}

export function reorderStudents(fromIndex: number, toIndex: number): void {
	const students = getStudents();
	const [moved] = students.splice(fromIndex, 1);
	students.splice(toIndex, 0, moved);
	setStudents(students);
}

export function deleteStudent(studentId: string): void {
	const students = getStudents().filter((s) => s.id !== studentId);
	setStudents(students);
}

export function addBehavior(
	studentId: string,
	data: { type: BehaviorType; timestamp: number }
): Behavior {
	const students = getStudents();
	const student = students.find((s) => s.id === studentId);
	if (!student) throw new Error(`Student ${studentId} not found`);

	const behavior: Behavior = {
		id: crypto.randomUUID(),
		...data,
	};
	student.behaviors.push(behavior);
	setStudents(students);
	return behavior;
}

export function updateBehavior(
	studentId: string,
	behaviorId: string,
	data: { type: BehaviorType; timestamp: number }
): void {
	const students = getStudents();
	const student = students.find((s) => s.id === studentId);
	if (!student) return;

	const index = student.behaviors.findIndex((b) => b.id === behaviorId);
	if (index === -1) return;

	student.behaviors[index] = { ...student.behaviors[index], ...data };
	setStudents(students);
}

export function deleteBehavior(studentId: string, behaviorId: string): void {
	const students = getStudents();
	const student = students.find((s) => s.id === studentId);
	if (!student) return;

	student.behaviors = student.behaviors.filter((b) => b.id !== behaviorId);
	setStudents(students);
}
