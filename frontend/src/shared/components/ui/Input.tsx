import { type ReactNode, forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leadingIcon?: ReactNode;
  state?: "default" | "success" | "error";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leadingIcon,
      state = "default",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const actualState = error ? "error" : state;

    const stateStyles = {
      default: "border-border focus:border-primary focus:ring-primary",
      success: "border-success focus:border-success focus:ring-success",
      error: "border-danger focus:border-danger focus:ring-danger",
    };

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block text-label text-text-primary mb-2 uppercase"
        >
          {label}
        </label>
        <div className="relative">
          {leadingIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {leadingIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full px-4 py-3 ${leadingIcon ? "pl-11" : ""} bg-surface border-2 rounded-input text-body text-text-primary placeholder:text-text-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${stateStyles[actualState]} ${className}`}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p
            className={`mt-2 text-small ${
              error ? "text-danger" : "text-text-secondary"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
