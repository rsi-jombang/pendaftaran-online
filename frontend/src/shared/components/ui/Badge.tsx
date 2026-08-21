import { type ReactNode } from "react";
import { motion } from "framer-motion";

export interface BadgeProps {
  status: "success" | "warning" | "danger" | "info" | "neutral";
  children: ReactNode;
  pulse?: boolean;
  className?: string;
}

export function Badge({ status, children, pulse = false, className = "" }: BadgeProps) {
  const statusStyles = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    info: "bg-secondary/10 text-secondary border-secondary/20",
    neutral: "bg-text-secondary/10 text-text-secondary border-text-secondary/20",
  };

  const pulseAnimation = pulse
    ? {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
      }
    : {};

  return (
    <motion.span
      animate={pulseAnimation}
      transition={{
        duration: 2,
        repeat: pulse ? Infinity : 0,
        ease: "easeInOut",
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-small font-medium border ${statusStyles[status]} ${className}`}
    >
      {pulse && (
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </motion.span>
  );
}
