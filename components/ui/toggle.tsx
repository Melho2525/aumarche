&apos;use client&apos;;

import * as React from &apos;react&apos;;
import * as TogglePrimitive from '@radix-ui/react-toggle&apos;;
import { cva, type VariantProps } from &apos;class-variance-authority&apos;;

import { cn } from '@/lib/utils&apos;;

const toggleVariants = cva(
  &apos;inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground&apos;,
  {
    variants: {
      variant: {
        default: &apos;bg-transparent&apos;,
        outline:
          &apos;border border-input bg-transparent hover:bg-accent hover:text-accent-foreground&apos;,
      },
      size: {
        default: &apos;h-10 px-3',
        sm: &apos;h-9 px-2.5',
        lg: &apos;h-11 px-5',
      },
    },
    defaultVariants: {
      variant: &apos;default&apos;,
      size: &apos;default&apos;,
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
