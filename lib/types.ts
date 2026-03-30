export const BEHAVIOR_TYPES = [
	'Refusing work',
	'Off task',
	'Not in assigned space',
	'Interrupting',
] as const;

export type BehaviorType = (typeof BEHAVIOR_TYPES)[number];

export interface Behavior {
	id: string;
	type: BehaviorType;
	timestamp: number;
}

export interface Student {
	id: string;
	firstName: string;
	lastName: string;
	behaviors: Behavior[];
}
