interface SkeletonProps {
	className?: string;
}

const Skeleton = ({ className = '' }: SkeletonProps) => {
	return <div className={`skeleton-shimmer rounded ${className}`} />;
};

export default Skeleton;
