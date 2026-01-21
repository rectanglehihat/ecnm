'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import type { CpiItemHierarchy } from '@/hooks/cpi/useCpiItemCodes';

interface HierarchyButtonsProps {
	children: Record<string, CpiItemHierarchy>;
}

const HierarchyButtons = ({ children }: HierarchyButtonsProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedCode = searchParams.get('code');

	const handleClick = (child: CpiItemHierarchy) => {
		const params = new URLSearchParams(searchParams.toString());

		if (selectedCode === child.code) {
			params.delete('code');
			params.delete('name');
		} else {
			params.set('code', child.code);
			params.set('name', child.name);
		}

		router.push(`?${params.toString()}`, { scroll: false });
	};

	return (
		<>
			<div className="flex flex-wrap gap-2">
				{Object.values(children || {}).map((child) => (
					<Button
						key={child.code}
						className={`cursor-pointer flex h-12 w-fit items-center justify-center gap-2 rounded-full px-5 text-background transition-colors font-semibold md:w-[158px] ${
							selectedCode === child.code ? 'bg-[#383838] dark:bg-[#ccc]' : 'bg-gray-300 text-gray-700'
						}`}
						onClick={() => handleClick(child)}
					>
						{child.name}
					</Button>
				))}
			</div>
		</>
	);
};

HierarchyButtons.displayName = 'HierarchyButtons';
export default HierarchyButtons;
