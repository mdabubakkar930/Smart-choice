import React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../utils/cn"

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
  </div>
))
Select.displayName = "Select"

const SelectItem = React.forwardRef(({ className, ...props }, ref) => (
  <option
    ref={ref}
    className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
    {...props}
  />
))
SelectItem.displayName = "SelectItem"

export { Select, SelectItem }
