import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-[4px] border-2 border-[var(--vv-color-blue)] bg-white px-3 py-3 font-[family-name:var(--vv-font-body)] text-base text-black transition-colors outline-none placeholder:text-black/45 focus-visible:border-black focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--vv-color-yellow)] disabled:cursor-not-allowed disabled:bg-black/10 disabled:opacity-60 aria-invalid:border-[var(--vv-color-coral)] aria-invalid:outline-[var(--vv-color-coral)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
