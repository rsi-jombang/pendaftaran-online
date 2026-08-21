import { type ReactNode } from "react";
import { motion } from "framer-motion";

export interface CardProps {
  variant?: "default" | "interactive" | "selected" | "disabled";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function Card({
  variant = "default",
  onClick,
  children,
  className = "",
}: CardProps) {
  const baseStyles =
    "bg-surface rounded-card p-6 transition-all duration-150";

  const variantStyles = {
    default: "shadow-soft",
    interactive:
      "shadow-soft hover:shadow-lg hover:-translate-y-1 cursor-pointer",
    selected: "shadow-soft border-2 border-primary",
    disabled: "shadow-soft opacity-50 cursor-not-allowed",
  };

  const Component = variant === "interactive" || variant === "selected" ? motion.div : "div";

  const motionProps =
    variant === "interactive" || variant === "selected"
      ? {
          whileHover: { y: -4, scale: 1.01 },
          whileTap: { scale: 0.98 },
        }
      : {};

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={variant === "disabled" ? undefined : onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
