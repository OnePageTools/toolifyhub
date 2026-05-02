import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[48px] md:h-[52px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[16px] md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
