interface GripProps {
	className?: string;
}

export function Grip({ className = 'h-4 w-4' }: GripProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<circle cx="7" cy="4" r="1.5" />
			<circle cx="13" cy="4" r="1.5" />
			<circle cx="7" cy="10" r="1.5" />
			<circle cx="13" cy="10" r="1.5" />
			<circle cx="7" cy="16" r="1.5" />
			<circle cx="13" cy="16" r="1.5" />
		</svg>
	);
}
