import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-[4px] border-2 border-[var(--vv-color-blue)] bg-white px-3 py-2 font-[family-name:var(--vv-font-body)] text-base text-black transition-colors outline-none file:mr-3 file:inline-flex file:h-8 file:border-0 file:bg-transparent file:font-bold file:text-black placeholder:text-black/45 focus-visible:border-black focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--vv-color-yellow)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-black/10 disabled:opacity-60 aria-invalid:border-[var(--vv-color-coral)] aria-invalid:outline-[var(--vv-color-coral)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
