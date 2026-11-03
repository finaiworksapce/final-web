"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        outline:
          "border border-slate-200 dark:border-slate-800 bg-background/80 hover:bg-accent/10 hover:text-accent-foreground backdrop-blur-sm text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        ghost:
          "hover:bg-accent/10 hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 sm:h-10 sm:px-4 sm:py-2 text-sm",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base sm:h-11 sm:px-6",
        icon: "h-11 w-11 sm:h-10 sm:w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ErrorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  render?: React.ReactElement<any>;
  nativeButton?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ErrorButtonProps>(
  ({ className, variant, size, render, nativeButton = true, children, onClick, ...props }, ref) => {
    const combinedClassName = cn(buttonVariants({ variant, size }), className);

    // If render element is provided (e.g. <a href="..." />) and nativeButton is false
    if (render && React.isValidElement(render) && !nativeButton) {
      const renderEl = render as React.ReactElement<any>;
      const renderProps = renderEl.props || {};
      return React.cloneElement(renderEl, {
        className: cn(combinedClassName, renderProps.className),
        onClick: (e: any) => {
          if (renderProps.onClick) renderProps.onClick(e);
          if (onClick) onClick(e);
        },
        children: children ?? renderProps.children,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        type={props.type || "button"}
        className={combinedClassName}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "ErrorButton";
