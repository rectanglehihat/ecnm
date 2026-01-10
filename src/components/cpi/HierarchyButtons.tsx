'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import type { CpiItemHierarchy } from '@/app/hooks/cpi/useCpiItemCodes';

interface HierarchyButtonsProps {
	children: Record<string, CpiItemHierarchy>;
	onClick?: (child: CpiItemHierarchy) => void;
}

const HierarchyButtons = ({ children, onClick }: HierarchyButtonsProps) => {
	const [selectedCode, setSelectedCode] = useState<string | null>(null);

	const handleClick = (child: CpiItemHierarchy) => {
		console.log('child', child);
		setSelectedCode(selectedCode === child.code ? null : child.code);
		onClick?.(child);
	};

	return (
		<>
			<div className="flex flex-wrap gap-2">
				{Object.values(children || {}).map((child) => (
					<Button
						key={child.code}
						className={`cursor-pointer flex h-12 w-fit items-center justify-center gap-2 rounded-full px-5 text-background transition-colors md:w-[158px] ${
							selectedCode === child.code
								? 'bg-[#383838] dark:bg-[#ccc]'
								: 'bg-foreground hover:bg-[#383838] dark:hover:bg-[#ccc]'
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

export default HierarchyButtons;
