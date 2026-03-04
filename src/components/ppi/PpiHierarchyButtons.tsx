'use client';

import Button from '@/components/ui/Button';

type Props = {
	data: {
		P_STAT_CODE: string;
		STAT_CODE: string;
		STAT_NAME: string;
		CYCLE: string;
		SRCH_YN: string;
		ORG_NAME: string;
	};
};

const PpiHierarchyButtons = ({ data }: Props) => {
	if (!data) return null;

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<Button
				key={data.STAT_CODE}
				// href={`/ppi/${data.STAT_CODE}?code=${Object.values(data.children ?? {})[0]?.ITEM_CODE ?? ''}&name=${data.name}`}
				className="flex h-auto w-full cursor-pointer items-center justify-center rounded-full bg-foreground px-4 py-2.5 text-sm text-background hover:bg-[#383838] dark:hover:bg-[#ccc] sm:px-6 sm:text-base"
			>
				{data.STAT_NAME}
			</Button>
		</div>
	);
};

export default PpiHierarchyButtons;
