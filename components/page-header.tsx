import Link from 'next/link';
import { ArrowLeft } from '@/components/icons/arrow-left';

interface PageHeaderProps {
	title: string;
	backHref?: string;
	backLabel?: string;
}

export function PageHeader({ title, backHref, backLabel = 'Back' }: PageHeaderProps) {
	return (
		<header className="mb-6">
			{backHref && (
				<Link
					href={backHref}
					className="mb-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
				>
					<ArrowLeft className="mr-1 h-4 w-4" />
					{backLabel}
				</Link>
			)}
			<h1 className="text-3xl font-bold text-gray-900">{title}</h1>
		</header>
	);
}
