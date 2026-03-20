"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const val = value?.[0] ?? defaultValue?.[0] ?? Number(min);

    return (
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => {
          if (onValueChange) {
            onValueChange([parseFloat(e.target.value)]);
          }
        }}
        className={cn(
          "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500",
          className
        )}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
