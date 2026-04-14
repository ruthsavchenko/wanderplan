import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-border/50 p-5 mb-4">
        <Icon className="h-8 w-8 text-muted" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-xl text-navy font-medium mb-2">{title}</h3>
      <p className="text-muted max-w-sm">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
