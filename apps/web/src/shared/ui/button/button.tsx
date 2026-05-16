import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:opacity-90",
  secondary:
    "border border-foreground/20 bg-transparent hover:bg-foreground/5",
  ghost: "bg-transparent opacity-75 hover:opacity-100 h-auto px-0",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 cursor-pointer items-center justify-center rounded-lg px-5 text-[15px] font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
