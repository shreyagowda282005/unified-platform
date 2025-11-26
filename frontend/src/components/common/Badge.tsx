import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps {
  children: ReactNode
  tone?: 'sage' | 'blush' | 'charcoal' | 'cream'
  className?: string
}

const toneMap: Record<Required<BadgeProps>['tone'], string> = {
  sage: 'bg-sage/15 text-sage',
  blush: 'bg-blush/15 text-blush',
  charcoal: 'bg-charcoal/10 text-charcoal',
  cream: 'bg-cream/30 text-olive',
}

export const Badge = ({ children, tone = 'sage', className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide',
      toneMap[tone],
      className
    )}
  >
    {children}
  </span>
)

