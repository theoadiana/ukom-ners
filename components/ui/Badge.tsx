import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-stone-100 text-stone-700",
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-primary-light text-primary",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
