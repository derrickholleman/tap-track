'use client';

interface FilterBarProps {
	value: string;
	onChange: (query: string) => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
	return (
		<div className="mx-auto mb-4 max-w-md">
			<label htmlFor="student-filter" className="sr-only">
				Filter students
			</label>
			<input
				id="student-filter"
				type="search"
				placeholder="Search students..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	);
}
