import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface GlassCardProps {
  children: ReactNode
  className?: string
  as?: 'section' | 'article' | 'div'
}

export const GlassCard = ({ children, className, as: Component = 'article' }: GlassCardProps) => {
  return (
    <Component
      className={cn(
        'rounded-[28px] border border-white/40 bg-white/60 p-6 shadow-glass backdrop-blur-xl',
        className
      )}
    >
      {children}
    </Component>
  )
}

