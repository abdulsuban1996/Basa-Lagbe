import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'residential'
  | 'commercial'
  | 'available'
  | 'rented'
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'verified'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  residential: 'bg-cloud-mint text-slate-ocean',
  commercial: 'bg-slate-ocean text-white',
  available: 'bg-green-100 text-green-700',
  rented: 'bg-red-100 text-red-600',
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  verified: 'bg-blue-100 text-blue-700',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
