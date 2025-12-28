import Link from 'next/link';
import React, { memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	className?: string;
	children: React.ReactNode;
}

const Button = ({ href, className = '', children, ...props }: ButtonProps) => {
	if (href) {
		return (
			<Link
				href={href}
				className={className}
			>
				{children}
			</Link>
		);
	}

	return (
		<button
			className={className}
			{...props}
		>
			{children}
		</button>
	);
};

export default memo(Button);
