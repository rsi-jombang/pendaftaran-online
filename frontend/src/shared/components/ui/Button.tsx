import { type ReactNode } from "react";
import { motion } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles: Record<string, { className: string; style: React.CSSProperties }> = {
    primary: {
      className: "text-white",
      style: {
        backgroundColor: "var(--color-primary)",
        borderRadius: "var(--radius-input)",
      },
    },
    secondary: {
      className: "bg-transparent text-white",
      style: {
        border: "2px solid var(--color-primary)",
        color: "var(--color-primary)",
        borderRadius: "var(--radius-input)",
      },
    },
    accent: {
      className: "text-white",
      style: {
        backgroundColor: "var(--color-accent)",
        borderRadius: "var(--radius-input)",
      },
    },
    ghost: {
      className: "",
      style: {
        color: "var(--color-primary)",
        backgroundColor: "transparent",
        borderRadius: "var(--radius-input)",
      },
    },
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const variantConfig = variantStyles[variant];

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`${baseStyles} ${variantConfig.className} ${sizeStyles[size]} ${widthStyle} ${className}`}
      style={variantConfig.style}
      disabled={disabled || loading}
      type={props.type || "button"}
      onClick={props.onClick}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span>{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
