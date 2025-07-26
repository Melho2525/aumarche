import * as React from &apos;react&apos;;
import { Slot } from '@radix-ui/react-slot&apos;;
import { cva, type VariantProps } from &apos;class-variance-authority&apos;;

import { cn } from '@/lib/utils&apos;;

const buttonVariants = cva(
  &apos;inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: &apos;bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          &apos;bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          &apos;border border-input bg-background hover:bg-accent hover:text-accent-foreground&apos;,
        secondary:
          &apos;bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: &apos;hover:bg-accent hover:text-accent-foreground&apos;,
        link: &apos;text-primary underline-offset-4 hover:underline&apos;,
      },
      size: {
        default: &apos;h-10 px-4 py-2',
        sm: &apos;h-9 rounded-md px-3',
        lg: &apos;h-11 rounded-md px-8',
        icon: &apos;h-10 w-10',
      },
    },
    defaultVariants: {
      variant: &apos;default&apos;,
      size: &apos;default&apos;,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : &apos;button&apos;;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = &apos;Button&apos;;

export { Button, buttonVariants };
