import * as React from &apos;react&apos;;
import { Slot } from '@radix-ui/react-slot&apos;;
import { ChevronRight, MoreHorizontal } from &apos;lucide-react&apos;;

import { cn } from '@/lib/utils&apos;;

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<&apos;nav&apos;> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = &apos;Breadcrumb&apos;;

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<&apos;ol&apos;>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      &apos;flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = &apos;BreadcrumbList&apos;;

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<&apos;li&apos;>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(&apos;inline-flex items-center gap-1.5', className)}
    {...props}
  />
));
BreadcrumbItem.displayName = &apos;BreadcrumbItem&apos;;

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<&apos;a&apos;> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : &apos;a&apos;;

  return (
    <Comp
      ref={ref}
      className={cn(&apos;transition-colors hover:text-foreground&apos;, className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = &apos;BreadcrumbLink&apos;;

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<&apos;span&apos;>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(&apos;font-normal text-foreground&apos;, className)}
    {...props}
  />
));
BreadcrumbPage.displayName = &apos;BreadcrumbPage&apos;;

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<&apos;li&apos;>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = &apos;BreadcrumbSeparator&apos;;

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<&apos;span&apos;>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(&apos;flex h-9 w-9 items-center justify-center&apos;, className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = &apos;BreadcrumbElipssis&apos;;

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
