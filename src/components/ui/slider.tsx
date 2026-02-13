"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Custom track class overrides */
  trackClassName?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, trackClassName, ...props }, ref) => {
    return (
      <input
        type="range"
        className={cn(
          "slider w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none",
          /* Track styles */
          "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-fenix-500 [&::-webkit-slider-runnable-track]:to-ember-500",
          "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-gradient-to-r [&::-moz-range-track]:from-fenix-500 [&::-moz-range-track]:to-ember-500",
          /* Thumb styles */
          "[&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-fenix-500 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:ring-2 [&::-moz-range-thumb]:ring-fenix-500 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110",
          /* Dark mode thumb */
          "dark:[&::-webkit-slider-thumb]:bg-ash-100 dark:[&::-webkit-slider-thumb]:ring-fenix-400",
          "dark:[&::-moz-range-thumb]:bg-ash-100 dark:[&::-moz-range-thumb]:ring-fenix-400",
          /* Focus ring */
          "focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-fenix-500/50",
          "focus-visible:[&::-moz-range-thumb]:ring-4 focus-visible:[&::-moz-range-thumb]:ring-fenix-500/50",
          /* Disabled */
          "disabled:cursor-not-allowed disabled:opacity-50",
          trackClassName,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
