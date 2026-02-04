'use client';

import Button from '@/components/ui/Button';
import { CpiItemHierarchy } from '@/lib/cpi/fetchCpiItemCodes';

interface Props {
	data: CpiItemHierarchy | CpiItemHierarchy[];
}

const CpiTopLevelButtons = ({ data }: Props) => {
	const topLevelNodes = Array.isArray(data)
		? data.flatMap((node) => Object.values(node.children))
		: Object.values(data.children);

	if (!topLevelNodes.length) return null;

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{topLevelNodes.map((node) => (
				<Button
					key={node.code}
					href={`/cpi/${node.code}?code=${Object.values(node.children ?? {})[0]?.code ?? ''}&name=${node.name}`}
					className="flex h-auto w-full items-center justify-center rounded-full bg-foreground px-4 py-2.5 text-sm text-background hover:bg-[#383838] dark:hover:bg-[#ccc] sm:px-6 sm:text-base"
				>
					{node.name}
				</Button>
			))}
		</div>
	);
};

CpiTopLevelButtons.displayName = 'CpiTopLevelButtons';
export default CpiTopLevelButtons;
