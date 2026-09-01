import { type ReactNode, forwardRef, useMemo } from "react";
import ReactSelect, { components, type StylesConfig } from "react-select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  leadingIcon?: ReactNode;
  placeholder?: string;
  loading?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  name?: string;
}

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
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
  </components.DropdownIndicator>
);

export const SearchableSelect = forwardRef<any, SearchableSelectProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      error,
      helperText,
      leadingIcon,
      placeholder = "Pilih...",
      loading = false,
      disabled = false,
      name,
    },
    ref
  ) => {
    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value) || null,
      [options, value]
    );

    const customStyles: StylesConfig<SelectOption, false> = {
      control: (base, state) => ({
        ...base,
        minHeight: "48px",
        paddingLeft: leadingIcon ? "2.75rem" : "0.75rem",
        paddingRight: "0.75rem",
        backgroundColor: "var(--color-surface)",
        borderWidth: "2px",
        borderColor: error
          ? "var(--color-danger)"
          : state.isFocused
          ? "var(--color-primary)"
          : "var(--color-border)",
        borderRadius: "var(--radius-input, 12px)",
        boxShadow: state.isFocused
          ? "0 0 0 2px var(--color-primary)"
          : "none",
        "&:hover": {
          borderColor: error ? "var(--color-danger)" : "var(--color-primary)",
        },
        cursor: "pointer",
        transition: "all 150ms",
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0.5rem 0",
      }),
      input: (base) => ({
        ...base,
        color: "var(--color-text-primary)",
        fontSize: "1rem",
        margin: 0,
        padding: 0,
      }),
      placeholder: (base) => ({
        ...base,
        color: "var(--color-text-secondary)",
        fontSize: "1rem",
      }),
      singleValue: (base) => ({
        ...base,
        color: "var(--color-text-primary)",
        fontSize: "1rem",
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-card, 16px)",
        border: "2px solid var(--color-border)",
        boxShadow: "var(--shadow-soft)",
        zIndex: 9999,
        marginTop: "0.25rem",
      }),
      menuList: (base) => ({
        ...base,
        padding: "0.5rem",
        maxHeight: "300px",
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "var(--color-primary)"
          : state.isFocused
          ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
          : "transparent",
        color: state.isSelected
          ? "white"
          : "var(--color-text-primary)",
        cursor: "pointer",
        padding: "0.75rem 1rem",
        borderRadius: "var(--radius-input, 8px)",
        fontSize: "1rem",
        "&:active": {
          backgroundColor: "var(--color-primary)",
        },
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color: "var(--color-text-secondary)",
        padding: "0.5rem",
        transition: "transform 150ms",
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
        "&:hover": {
          color: "var(--color-text-primary)",
        },
      }),
      loadingIndicator: (base) => ({
        ...base,
        color: "var(--color-primary)",
      }),
      noOptionsMessage: (base) => ({
        ...base,
        color: "var(--color-text-secondary)",
        padding: "1rem",
        fontSize: "0.875rem",
      }),
    };

    return (
      <div className="w-full">
        <label className="block text-label text-text-primary mb-2 uppercase">
          {label}
        </label>

        <div className="relative">
          {leadingIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10">
              {leadingIcon}
            </div>
          )}
          <ReactSelect
            ref={ref}
            name={name}
            options={options}
            value={selectedOption}
            onChange={(newValue) => {
              if (onChange && newValue) {
                onChange(newValue.value);
              }
            }}
            styles={customStyles}
            components={{ DropdownIndicator }}
            placeholder={placeholder}
            noOptionsMessage={() => "Tidak ditemukan"}
            loadingMessage={() => "Memuat..."}
            isLoading={loading}
            isDisabled={disabled || loading}
            isSearchable={true}
            isClearable={false}
            menuPlacement="auto"
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            filterOption={(option, inputValue) => {
              if (!inputValue) return true;
              return option.label.toLowerCase().includes(inputValue.toLowerCase());
            }}
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

SearchableSelect.displayName = "SearchableSelect";
