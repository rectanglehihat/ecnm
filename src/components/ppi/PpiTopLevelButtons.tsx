'use client';

import Button from '@/components/ui/Button';
import { PpiStatisticTableListType } from '@/lib/ppi/fetchPpiStatisticTableList';

type Props = {
	data: PpiStatisticTableListType;
};

const PpiTopLevelButtons = ({ data }: Props) => {
	if (!data) return null;

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{/* {data.map((node) => (
				<Button
					key={node.code}
					href={`/ppi/${node.code}?code=${Object.values(node.children ?? {})[0]?.ITEM_CODE ?? ''}&name=${node.name}`}
					className="flex h-auto w-full items-center justify-center rounded-full bg-foreground px-4 py-2.5 text-sm text-background hover:bg-[#383838] dark:hover:bg-[#ccc] sm:px-6 sm:text-base"
				>
					{node.name}
				</Button>
			))} */}
			<Button
				href={`/ppi/${data.STAT_CODE}?code=${data.STAT_CODE ?? ''}&name=${data.STAT_NAME}`}
				className="flex h-auto w-full items-center justify-center rounded-full bg-foreground px-4 py-2.5 text-sm text-background hover:bg-[#383838] dark:hover:bg-[#ccc] sm:px-6 sm:text-base"
			>
				{data.STAT_NAME}
			</Button>
		</div>
	);
};

PpiTopLevelButtons.displayName = 'PpiTopLevelButtons';
export default PpiTopLevelButtons;
