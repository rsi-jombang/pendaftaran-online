import { type ReactNode, forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  leadingIcon?: ReactNode;
  placeholder?: string;
  loading?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      leadingIcon,
      placeholder = "Pilih...",
      loading = false,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");
    const stateStyles = error
      ? "border-danger focus:border-danger focus:ring-danger"
      : "border-border focus:border-primary focus:ring-primary";

    return (
      <div className="w-full">
        <label
          htmlFor={selectId}
          className="block text-label text-text-primary mb-2 uppercase"
        >
          {label}
        </label>
        <div className="relative">
          {leadingIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {leadingIcon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            className={`w-full px-4 py-3 ${leadingIcon ? "pl-11" : ""} pr-10 bg-surface border-2 rounded-input text-body text-text-primary placeholder:text-text-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed appearance-none ${stateStyles} ${className}`}
            disabled={loading || props.disabled}
            {...props}
          >
            <option value="" disabled>
              {loading ? "Memuat..." : placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = "Select";
