import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium opacity-85">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-11 w-full rounded-lg border border-foreground/20 bg-transparent px-3.5 text-[15px] outline-none transition placeholder:text-foreground/40 focus:border-foreground focus:ring-2 focus:ring-foreground/15",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  );
});
