"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-ash-300 bg-white px-3 py-2 text-sm text-ash-900 shadow-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ash-900",
          "placeholder:text-ash-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fenix-500/50 focus-visible:border-fenix-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-ash-700 dark:bg-ash-900 dark:text-ash-100 dark:placeholder:text-ash-500",
          "dark:file:text-ash-100",
          "dark:focus-visible:ring-fenix-500/50 dark:focus-visible:border-fenix-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
