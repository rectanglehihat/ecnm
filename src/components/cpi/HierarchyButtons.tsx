'use client';

import { memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import type { CpiItemHierarchy } from '@/lib/cpi/fetchCpiItemCodes';
import { PpiItemHierarchy } from '@/lib/ppi/fetchPpiItemCodes';

interface HierarchyButtonsProps {
	children: Record<string, CpiItemHierarchy> | PpiItemHierarchy[];
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
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{Object.values(children || {}).map((child) => (
					<Button
						key={child.code}
						className={`cursor-pointer flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-background transition-colors sm:h-12 sm:px-5 sm:text-base ${
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
export default memo(HierarchyButtons);
