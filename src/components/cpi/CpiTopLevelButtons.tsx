'use client';

import Button from '@/components/ui/Button';
import { CpiItemHierarchy } from '@/hooks/cpi/useCpiItemCodes';

type Props = {
	data: CpiItemHierarchy | CpiItemHierarchy[];
};

export const CpiTopLevelButtons = ({ data }: Props) => {
	const topLevelNodes = Array.isArray(data)
		? data.flatMap((node) => Object.values(node.children))
		: Object.values(data.children);

	if (!topLevelNodes.length) return null;

	return (
		<div className="flex flex-wrap gap-3">
			{topLevelNodes.map((node) => (
				<Button
					key={node.code}
					href={`/cpi/${node.code}`}
					// href={`/cpi/${node.code}?name=${node.name}`}
					className="h-fit w-fit rounded-full bg-foreground px-6 py-2 text-background text-md hover:bg-[#383838] dark:hover:bg-[#ccc]"
				>
					{node.name}
				</Button>
			))}
		</div>
	);
};
