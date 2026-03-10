'use client';

import { memo } from 'react';
import Button from '@/components/ui/Button';
import { PpiItemHierarchy } from '@/lib/ppi/fetchPpiItemCodes';

type Props = {
	data: PpiItemHierarchy[];
};

const PpiTopLevelButtons = ({ data }: Props) => {
	if (!data) return null;

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{data.map((node) => (
				<Button
					key={node.code}
					href={`/ppi/${node.code}?code=${Object.values(node.children ?? {})[0]?.ITEM_CODE ?? ''}&name=${node.name}`}
					className="flex h-auto w-full items-center justify-center rounded-full bg-foreground px-4 py-2.5 text-sm text-background hover:bg-[#383838] dark:hover:bg-[#ccc] sm:px-6 sm:text-base"
				>
					{node.name}
				</Button>
			))}
		</div>
	);
};

PpiTopLevelButtons.displayName = 'PpiTopLevelButtons';
export default memo(PpiTopLevelButtons);
