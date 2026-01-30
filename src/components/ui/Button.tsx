import Link from 'next/link';
import React, { memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	className?: string;
	children: React.ReactNode;
	onClick?: () => void;
}

const Button = ({ href, className = '', children, ...props }: ButtonProps) => {
	if (href) {
		return (
			<Link
				href={href}
				className={`retro-button ${className}`}
			>
				{children}
			</Link>
		);
	}

	return (
		<button
			className={`retro-button ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default memo(Button);
