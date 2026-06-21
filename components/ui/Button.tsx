"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tracking-wide text-xs uppercase";

    const variants = {
      primary: "bg-[--color-foreground] text-white hover:bg-[--color-primary] focus-visible:outline-[--color-foreground]",
      secondary: "bg-[--color-primary] text-white hover:bg-[--color-primary-dark] focus-visible:outline-[--color-primary]",
      outline: "border border-[--color-border] text-[--color-foreground] hover:border-[--color-foreground] focus-visible:outline-[--color-foreground]",
      ghost: "text-[--color-foreground] hover:bg-black/5 focus-visible:outline-gray-400",
      danger: "bg-[--color-error] text-white hover:bg-red-700 focus-visible:outline-[--color-error]",
    };

    const sizes = {
      sm: "px-4 py-2.5 gap-1.5",
      md: "px-6 py-3 gap-2",
      lg: "px-8 py-4 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
