&apos;use client&apos;;

import * as React from &apos;react&apos;;
import { ChevronLeft, ChevronRight } from &apos;lucide-react&apos;;
import { DayPicker } from &apos;react-day-picker&apos;;

import { cn } from '@/lib/utils&apos;;
import { buttonVariants } from '@/components/ui/button&apos;;

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(&apos;p-3', className)}
      classNames={{
        months: &apos;flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: &apos;space-y-4',
        caption: &apos;flex justify-center pt-1 relative items-center&apos;,
        caption_label: &apos;text-sm font-medium&apos;,
        nav: &apos;space-x-1 flex items-center&apos;,
        nav_button: cn(
          buttonVariants({ variant: &apos;outline&apos; }),
          &apos;h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: &apos;absolute left-1',
        nav_button_next: &apos;absolute right-1',
        table: &apos;w-full border-collapse space-y-1',
        head_row: &apos;flex&apos;,
        head_cell:
          &apos;text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: &apos;flex w-full mt-2',
        cell: &apos;h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: &apos;ghost&apos; }),
          &apos;h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_end: &apos;day-range-end&apos;,
        day_selected:
          &apos;bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground&apos;,
        day_today: &apos;bg-accent text-accent-foreground&apos;,
        day_outside:
          &apos;day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: &apos;text-muted-foreground opacity-50',
        day_range_middle:
          &apos;aria-selected:bg-accent aria-selected:text-accent-foreground&apos;,
        day_hidden: &apos;invisible&apos;,
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = &apos;Calendar&apos;;

export { Calendar };
