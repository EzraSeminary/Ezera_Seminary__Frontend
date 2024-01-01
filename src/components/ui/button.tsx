import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, Variants } from "class-variance-authority"; // Assuming 'Variants' is the type for variants in class-variance-authority
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

type ButtonProps = {
  className?: string;
  variant?: keyof Variants;
  size?: keyof (typeof buttonVariants)["defaultVariants"]["size"];
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const buttonVariants = cva({
  classNames:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "font-nokia-bold bg-primary-1 rounded-full border border-accent-6 hover:bg-accent-6 text-accent-6 hover:text-primary-1 transition-colors",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      primary:
        "font-nokia-bold bg-accent-6 hover:bg-accent-7 text-white transition-colors",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-full px-3",
      lg: "h-11 rounded-md px-8",
      round: "h-10 rounded-full px-4",
      icon: "h-10 w-10",
      devotion: "px-4 py-1 rounded-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  asChild: PropTypes.bool,
};

Button.displayName = "Button";

export { Button, buttonVariants };
