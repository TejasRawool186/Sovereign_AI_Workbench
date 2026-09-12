import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "flat";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variants: Record<string, string> = {
    default:
      "bg-[#102A35] border border-[rgba(145,190,200,0.10)] rounded-xl",
    elevated:
      "bg-[#102A35] border border-[rgba(145,190,200,0.14)] rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.24)]",
    interactive:
      "bg-[#102A35] border border-[rgba(145,190,200,0.10)] rounded-xl " +
      "hover:bg-[#13303D] hover:border-[rgba(145,190,200,0.18)] " +
      "transition-colors duration-150 cursor-pointer",
    flat:
      "bg-[#0D222C] border border-[rgba(145,190,200,0.08)] rounded-xl",
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
