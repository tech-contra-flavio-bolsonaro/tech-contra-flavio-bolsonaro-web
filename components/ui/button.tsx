import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { PressSurface } from "./press-surface";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] border-[3px] border-black bg-clip-padding font-[family-name:var(--vv-font-body)] font-bold text-black transition-colors outline-none select-none shadow-[7px_7px_0px_0px_black] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[var(--vv-color-yellow)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none aria-invalid:border-[var(--vv-color-coral)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        default: "bg-[var(--vv-color-yellow)] text-black",
        coral: "bg-[var(--vv-color-coral)] text-black",
        white: "bg-white text-[var(--vv-color-blue)]",
        outline:
          "border-white bg-transparent text-white aria-expanded:bg-white aria-expanded:text-[var(--vv-color-blue)]",
        secondary:
          "bg-[var(--vv-color-coral)] text-black aria-expanded:bg-[var(--vv-color-yellow)]",
        ghost:
          "border-transparent bg-transparent text-current shadow-none hover:border-current hover:bg-white/10 aria-expanded:bg-white/10",
        destructive:
          "bg-[var(--vv-color-coral)] text-black focus-visible:outline-[var(--vv-color-coral)]",
        link: "border-transparent bg-transparent p-0 text-current shadow-none underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-6 px-[22px] text-[15px]",
        xs: "h-8 gap-2 px-3 text-xs [&_svg:not([class*='size-'])]:size-4",
        sm: "h-10 gap-3 px-4 text-sm [&_svg:not([class*='size-'])]:size-5",
        lg: "h-[58px] gap-6 px-[22px] text-[17px]",
        icon: "size-12 p-0",
        "icon-xs": "size-8 p-0 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-10 p-0 [&_svg:not([class*='size-'])]:size-5",
        "icon-lg": "size-[58px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-press={variant !== "ghost" && variant !== "link" ? "" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {variant === "ghost" || variant === "link" ? children : <PressSurface>{children}</PressSurface>}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
