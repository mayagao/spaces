"use client";

import { cn } from "../../../lib/utils";
import type { Icon as IconType } from "@primer/octicons-react";

interface IconButtonProps {
  icon: IconType;
  label?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
  showText?: boolean;
  className?: string;
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  size = "md",
  showText = false,
  className,
}: IconButtonProps) {
  const variantStyles = {
    default: "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
    outline:
      "border text-gray-600 border-gray-200 dark:border-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
  };

  const sizeStyles = {
    sm: showText ? "px-3 h-8" : "p-1.5",
    md: showText ? "px-3 h-10" : "p-2",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg h-[32px] w-[32px] transition-colors flex items-center gap-2",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      title={!showText ? label : undefined}
    >
      <Icon size={16} />
      {showText && label && (
        <span
          className={cn("font-medium", size === "sm" ? "text-sm" : "text-base")}
        >
          {label}
        </span>
      )}
    </button>
  );
}
