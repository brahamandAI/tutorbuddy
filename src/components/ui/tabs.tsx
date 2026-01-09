import * as React from 'react'

interface TabsContextValue {
	value: string
	setValue: (v: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string
	onValueChange?: (value: string) => void
}

export function Tabs({ value, onValueChange, className, children, ...props }: TabsProps) {
	const [internalValue, setInternalValue] = React.useState<string>(value)

	React.useEffect(() => {
		setInternalValue(value)
	}, [value])

	const handleSetValue = (v: string) => {
		setInternalValue(v)
		onValueChange?.(v)
	}

	return (
		<div className={className} {...props}>
			<TabsContext.Provider value={{ value: internalValue, setValue: handleSetValue }}>
				{children}
			</TabsContext.Provider>
		</div>
	)
}

export function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div role="tablist" className={className} {...props}>
			{children}
		</div>
	)
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string
}

export function TabsTrigger({ value, className = '', children, ...props }: TabsTriggerProps) {
	const ctx = React.useContext(TabsContext)
	if (!ctx) throw new Error('TabsTrigger must be used within Tabs')
	const isActive = ctx.value === value
	return (
		<button
			role="tab"
			aria-selected={isActive}
			onClick={() => ctx.setValue(value)}
			className={`${className} ${isActive ? '' : ''}`}
			{...props}
		>
			{children}
		</button>
	)
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
	const ctx = React.useContext(TabsContext)
	if (!ctx) return null
	if (ctx.value !== value) return null
	return (
		<div role="tabpanel" className={className} {...props}>
			{children}
		</div>
	)
} 