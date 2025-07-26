import * as React from &apos;react&apos;;
import { ChevronLeft, ChevronRight, MoreHorizontal } from &apos;lucide-react&apos;;

import { cn } from '@/lib/utils&apos;;
import { ButtonProps, buttonVariants } from '@/components/ui/button&apos;;

const Pagination = ({ className, ...props }: React.ComponentProps<&apos;nav&apos;>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn(&apos;mx-auto flex w-full justify-center&apos;, className)}
    {...props}
  />
);
Pagination.displayName = &apos;Pagination&apos;;

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<&apos;ul&apos;>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(&apos;flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = &apos;PaginationContent&apos;;

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<&apos;li&apos;>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = &apos;PaginationItem&apos;;

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, &apos;size&apos;> &
  React.ComponentProps<&apos;a&apos;>;

const PaginationLink = ({
  className,
  isActive,
  size = &apos;icon&apos;,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? &apos;page&apos; : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? &apos;outline&apos; : &apos;ghost&apos;,
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = &apos;PaginationLink&apos;;

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(&apos;gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = &apos;PaginationPrevious&apos;;

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(&apos;gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = &apos;PaginationNext&apos;;

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<&apos;span&apos;>) => (
  <span
    aria-hidden
    className={cn(&apos;flex h-9 w-9 items-center justify-center&apos;, className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = &apos;PaginationEllipsis&apos;;

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
