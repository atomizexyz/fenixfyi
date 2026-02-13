"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-fenix-500/50 focus:ring-offset-2 dark:focus:ring-offset-ash-950",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-fenix-500 text-white shadow-sm hover:bg-fenix-600 dark:bg-fenix-600 dark:hover:bg-fenix-500",
        secondary:
          "border-transparent bg-ash-100 text-ash-900 hover:bg-ash-200 dark:bg-ash-800 dark:text-ash-100 dark:hover:bg-ash-700",
        success:
          "border-transparent bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500",
        warning:
          "border-transparent bg-amber-500 text-white shadow-sm hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500",
        destructive:
          "border-transparent bg-ember-500 text-white shadow-sm hover:bg-ember-600 dark:bg-ember-600 dark:hover:bg-ember-500",
        outline:
          "border-ash-300 text-ash-700 dark:border-ash-700 dark:text-ash-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
