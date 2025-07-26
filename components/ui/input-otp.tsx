&apos;use client&apos;;

import * as React from &apos;react&apos;;
import { OTPInput, OTPInputContext } from &apos;input-otp&apos;;
import { Dot } from &apos;lucide-react&apos;;

import { cn } from '@/lib/utils&apos;;

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      &apos;flex items-center gap-2 has-[:disabled]:opacity-50',
      containerClassName
    )}
    className={cn(&apos;disabled:cursor-not-allowed&apos;, className)}
    {...props}
  />
));
InputOTP.displayName = &apos;InputOTP&apos;;

const InputOTPGroup = React.forwardRef<
  React.ElementRef<&apos;div&apos;>,
  React.ComponentPropsWithoutRef<&apos;div&apos;>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(&apos;flex items-center&apos;, className)} {...props} />
));
InputOTPGroup.displayName = &apos;InputOTPGroup&apos;;

const InputOTPSlot = React.forwardRef<
  React.ElementRef<&apos;div&apos;>,
  React.ComponentPropsWithoutRef<&apos;div&apos;> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        &apos;relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md&apos;,
        isActive && &apos;z-10 ring-2 ring-ring ring-offset-background&apos;,
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = &apos;InputOTPSlot&apos;;

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<&apos;div&apos;>,
  React.ComponentPropsWithoutRef<&apos;div&apos;>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = &apos;InputOTPSeparator&apos;;

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
