import { Badge } from './common/Badge'
import { cn } from '../utils/cn'

interface StatCardProps {
  label: string
  value: string
  badge?: string
  trend?: string
  variant?: 'default' | 'accent'
}

export const StatCard = ({ label, value, badge, trend, variant = 'default' }: StatCardProps) => (
  <article
    className={cn(
      'rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-card',
      variant === 'accent' && 'bg-sage text-white'
    )}
  >
    <p className={cn('text-xs uppercase tracking-[0.4em] text-charcoal/40', variant === 'accent' && 'text-white/70')}>
      {label}
    </p>
    <p className={cn('mt-2 text-3xl font-semibold text-charcoal', variant === 'accent' && 'text-white')}>{value}</p>
    <div className="mt-3 flex items-center gap-3 text-sm">
      {badge && <Badge tone={variant === 'accent' ? 'cream' : 'sage'}>{badge}</Badge>}
      {trend && (
        <span className={cn('text-sage', variant === 'accent' && 'text-white/80')}>
          {trend}
        </span>
      )}
    </div>
  </article>
)

