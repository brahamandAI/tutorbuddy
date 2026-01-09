import * as React from 'react'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
	value?: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
	({ value = 0, className = '', ...props }, ref) => {
		const clamped = Math.max(0, Math.min(100, value))
		return (
			<div ref={ref} className={`w-full bg-muted rounded-full h-2 ${className}`} {...props}>
				<div
					className="bg-primary h-2 rounded-full transition-all duration-300"
					style={{ width: `${clamped}%` }}
				/>
			</div>
		)
	}
)

Progress.displayName = 'Progress' 