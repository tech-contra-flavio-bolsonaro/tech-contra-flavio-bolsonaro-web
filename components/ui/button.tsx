import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] border-[3px] border-black bg-clip-padding font-[family-name:var(--vv-font-body)] font-bold text-black transition-[transform,box-shadow,background-color,color] outline-none select-none shadow-[7px_7px_0px_0px_black] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[var(--vv-color-yellow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[5px_5px_0px_0px_black] disabled:pointer-events-none disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none aria-invalid:border-[var(--vv-color-coral)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        default: "bg-[var(--vv-color-yellow)] text-black hover:bg-white",
        coral: "bg-[var(--vv-color-coral)] text-black hover:bg-[var(--vv-color-yellow)]",
        white: "bg-white text-[var(--vv-color-blue)] hover:bg-[var(--vv-color-lilac)]",
        outline:
          "border-white bg-transparent text-white hover:bg-white hover:text-[var(--vv-color-blue)] aria-expanded:bg-white aria-expanded:text-[var(--vv-color-blue)]",
        secondary:
          "bg-[var(--vv-color-coral)] text-black hover:bg-[var(--vv-color-yellow)] aria-expanded:bg-[var(--vv-color-yellow)]",
        ghost:
          "border-transparent bg-transparent text-current shadow-none hover:border-current hover:bg-white/10 aria-expanded:bg-white/10",
        destructive:
          "bg-[var(--vv-color-coral)] text-black hover:bg-white focus-visible:outline-[var(--vv-color-coral)]",
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
