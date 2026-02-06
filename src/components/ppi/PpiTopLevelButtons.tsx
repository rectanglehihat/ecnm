'use client';

import Button from '@/components/ui/Button';
import { StatisticItem } from '@/lib/cpi/fetchCpiItemCodes';

type Props = {
	data: StatisticItem[];
};

const PpiTopLevelButtons = ({ data }: Props) => {
	if (!data) return null;

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{data.map((node) => (
				<Button
					key={node.ITEM_CODE}
					href={`/cpi/${node.ITEM_CODE}?name=${node.ITEM_NAME}`}
					className="flex h-auto w-full items-center justify-center rounded-full bg-foreground px-4 py-2.5 text-sm text-background hover:bg-[#383838] dark:hover:bg-[#ccc] sm:px-6 sm:text-base"
				>
					{node.ITEM_NAME}
				</Button>
			))}
		</div>
	);
};

PpiTopLevelButtons.displayName = 'PpiTopLevelButtons';
export default PpiTopLevelButtons;
