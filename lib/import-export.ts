import { Student } from './types';

export function downloadJson(data: string, filename: string) {
	const blob = new Blob([data], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function parseImportFile(file: File): Promise<Student[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const parsed = JSON.parse(event.target?.result as string);
				if (!Array.isArray(parsed)) throw new Error('Invalid format');
				resolve(parsed as Student[]);
			} catch {
				reject(new Error('Invalid file format'));
			}
		};
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsText(file);
	});
}
