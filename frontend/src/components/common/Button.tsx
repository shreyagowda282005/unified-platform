import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-3xl font-accent tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-sage text-white shadow-card hover:-translate-y-0.5 hover:shadow-halo focus-visible:ring-sage',
        secondary:
          'bg-transparent text-olive border border-olive/30 hover:bg-olive/5 focus-visible:ring-olive',
        outline:
          'bg-white/10 text-ivory border border-white/40 backdrop-blur-md hover:bg-white/20 focus-visible:ring-white',
        ghost: 'bg-transparent text-charcoal hover:text-olive',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-3.5 text-base',
        pill: 'px-6 py-2.5 text-sm rounded-full',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
}

export const Button = ({
  className,
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  asChild = false,
  children,
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot : 'button'
  const content = (
    <span className="inline-flex items-center justify-center gap-2">
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </span>
  )

  return (
    <Component className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props}>
      {content}
    </Component>
  )
}

