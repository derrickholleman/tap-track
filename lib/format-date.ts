function getOrdinalSuffix(day: number): string {
	if (day >= 11 && day <= 13) return 'th';
	switch (day % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

export function timestampToDateString(timestamp: number): string {
	const d = new Date(timestamp);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function timestampToTimeString(timestamp: number): string {
	const d = new Date(timestamp);
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
}

export function formatBehaviorDate(timestamp: number): string {
	const date = new Date(timestamp);

	const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
	const month = date.toLocaleDateString('en-US', { month: 'long' });
	const day = date.getDate();
	const suffix = getOrdinalSuffix(day);

	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12 || 12;

	const minuteStr = minutes.toString().padStart(2, '0');

	return `${weekday}, ${month} ${day}${suffix} ${hours}:${minuteStr}${ampm}`;
}
