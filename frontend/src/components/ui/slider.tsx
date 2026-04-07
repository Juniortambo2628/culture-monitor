"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onValueChange,
  ...props
}: {
  className?: string
  defaultValue?: number[]
  value?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onValueChange?: (value: number[]) => void
}) {
  const [internalValue, setInternalValue] = React.useState(
    value?.[0] ?? defaultValue?.[0] ?? min
  )

  React.useEffect(() => {
    if (value !== undefined && value.length > 0) {
      setInternalValue(value[0])
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const newValue = Number(e.target.value)
    setInternalValue(newValue)
    if (onValueChange) {
      onValueChange([newValue])
    }
  }

  // Calculate percentage to fill the gradient track correctly
  const percentage = max > min ? ((internalValue - min) / (max - min)) * 100 : 0

  return (
    <div className={cn("relative flex w-full touch-none items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internalValue}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full h-1.5 rounded-full appearance-none outline-none",
          // Webkit Thumb
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
          "[&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary",
          "[&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 focus-visible:[&::-webkit-slider-thumb]:ring-2",
          "focus-visible:[&::-webkit-slider-thumb]:ring-ring [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:cursor-grab",
          // Firefox Thumb
          "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4",
          "[&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-primary",
          "[&::-moz-range-thumb]:rounded-full hover:[&::-moz-range-thumb]:scale-125 focus-visible:[&::-moz-range-thumb]:ring-2",
          "focus-visible:[&::-moz-range-thumb]:ring-ring [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:cursor-grab",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) ${percentage}%, hsl(var(--secondary)) ${percentage}%)`
        }}
        {...(props as any)}
      />
    </div>
  )
}

export { Slider }
