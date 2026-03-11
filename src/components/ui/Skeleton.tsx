import { memo } from 'react';

interface SkeletonProps {
	className?: string;
}

const Skeleton = memo(({ className = '' }: SkeletonProps) => {
	return <div className={`skeleton-shimmer rounded ${className}`} />;
});

Skeleton.displayName = 'Skeleton';
export default memo(Skeleton);
