import * as React from &apos;react&apos;;
import { cva, type VariantProps } from &apos;class-variance-authority&apos;;

import { cn } from '@/lib/utils&apos;;

const badgeVariants = cva(
  &apos;inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          &apos;border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          &apos;border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          &apos;border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: &apos;text-foreground&apos;,
      },
    },
    defaultVariants: {
      variant: &apos;default&apos;,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
