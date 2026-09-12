import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "accent" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants: Record<string, string> = {
    default:  "bg-[rgba(127,146,155,0.10)] text-[#7F929B] border-[rgba(127,146,155,0.18)]",
    success:  "bg-[rgba(69,196,154,0.10)]  text-[#45C49A] border-[rgba(69,196,154,0.22)]",
    warning:  "bg-[rgba(229,184,92,0.10)]  text-[#E5B85C] border-[rgba(229,184,92,0.22)]",
    danger:   "bg-[rgba(228,106,106,0.10)] text-[#E46A6A] border-[rgba(228,106,106,0.22)]",
    info:     "bg-[rgba(91,150,194,0.10)]  text-[#5B96C2] border-[rgba(91,150,194,0.22)]",
    accent:   "bg-[rgba(56,184,176,0.10)]  text-[#38B8B0] border-[rgba(56,184,176,0.22)]",
    outline:  "bg-transparent text-[#B6C4CA] border-[rgba(145,190,200,0.20)]",
  };

  const sizes: Record<string, string> = {
    sm: "px-1.5 py-0.5 text-[9.5px] rounded",
    md: "px-2    py-0.5 text-[10.5px] rounded",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border font-semibold whitespace-nowrap",
        "font-mono tracking-tight",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
