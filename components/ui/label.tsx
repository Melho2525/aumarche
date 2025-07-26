&apos;use client&apos;;

import * as React from &apos;react&apos;;
import * as LabelPrimitive from '@radix-ui/react-label&apos;;
import { cva, type VariantProps } from &apos;class-variance-authority&apos;;

import { cn } from '@/lib/utils&apos;;

const labelVariants = cva(
  &apos;text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
