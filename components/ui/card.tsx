import * as React from "react"
import { cn } from "cn"

function Card({
  className,
  size = "default",
  tone = "blue",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  tone?: "blue" | "yellow" | "coral" | "white"
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-tone={tone}
      className={cn(
        "group/card flex flex-col gap-[20px] overflow-hidden rounded-[8px] border-[3px] border-black py-[28px] text-[16px] shadow-[7px_7px_0px_0px_black] [--card-spacing:28px] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:20px] data-[size=sm]:gap-4 data-[size=sm]:py-5 data-[size=sm]:has-data-[slot=card-footer]:pb-0 data-[tone=blue]:bg-[var(--vv-color-blue)] data-[tone=blue]:text-white data-[tone=yellow]:bg-[var(--vv-color-yellow)] data-[tone=yellow]:text-black data-[tone=coral]:bg-[var(--vv-color-coral)] data-[tone=coral]:text-black data-[tone=white]:bg-white data-[tone=white]:text-black *:[img:first-child]:rounded-t-[5px] *:[img:last-child]:rounded-b-[5px]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-[family-name:var(--vv-font-display)] text-[38px] leading-none font-bold group-data-[size=sm]/card:text-2xl",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("font-[family-name:var(--vv-font-body)] leading-6 opacity-80", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center border-t-[3px] border-black/15 px-(--card-spacing) py-5",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
