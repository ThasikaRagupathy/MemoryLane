"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[6px]";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-olive text-paper hover:bg-olive-dark active:bg-olive-dark shadow-sm focus-visible:ring-olive focus-visible:ring-offset-paper",
      secondary:
        "bg-paper-deep text-ink hover:bg-[#E5DDCF] active:bg-[#DCD3C4] border border-line focus-visible:ring-olive focus-visible:ring-offset-paper",
      outline:
        "border border-line bg-transparent text-ink hover:bg-paper-deep/60 active:bg-paper-deep focus-visible:ring-olive focus-visible:ring-offset-paper",
      ghost:
        "bg-transparent text-ink-muted hover:text-ink hover:bg-paper-deep/60 active:bg-paper-deep focus-visible:ring-olive focus-visible:ring-offset-paper",
      danger:
        "bg-terracotta text-paper hover:bg-terracotta-dark active:bg-terracotta-dark focus-visible:ring-terracotta focus-visible:ring-offset-paper",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-3.5 py-2 gap-2 min-h-[40px]",
      lg: "text-base px-5 py-2.5 gap-2.5 min-h-[46px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
