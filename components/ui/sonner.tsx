&apos;use client&apos;;

import { useTheme } from &apos;next-themes&apos;;
import { Toaster as Sonner } from &apos;sonner&apos;;

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = &apos;system&apos; } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps[&apos;theme&apos;]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            &apos;group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg&apos;,
          description: &apos;group-[.toast]:text-muted-foreground&apos;,
          actionButton:
            &apos;group-[.toast]:bg-primary group-[.toast]:text-primary-foreground&apos;,
          cancelButton:
            &apos;group-[.toast]:bg-muted group-[.toast]:text-muted-foreground&apos;,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
