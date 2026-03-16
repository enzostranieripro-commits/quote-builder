import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-[1px] shadow-md hover:shadow-lg rounded-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg",
        outline: "border border-input bg-background hover:bg-secondary hover:text-secondary-foreground rounded-lg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg",
        ghost: "hover:bg-secondary hover:text-secondary-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-[1px] shadow-md hover:shadow-lg rounded-lg text-base font-semibold",
        heroGhost: "border border-border bg-background text-foreground hover:bg-secondary hover:-translate-y-[1px] rounded-lg text-base font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-lg px-8",
        xl: "h-14 rounded-lg px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
