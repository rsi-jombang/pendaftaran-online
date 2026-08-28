export interface SkeletonProps {
  variant: "text" | "card" | "avatar" | "button";
  width?: string | number;
  height?: string | number;
  className?: string;
}

const variantStyles: Record<string, string> = {
  text: "h-4 w-full rounded",
  card: "h-48 w-full rounded-card",
  avatar: "h-12 w-12 rounded-full",
  button: "h-11 w-32 rounded-input",
};

export function Skeleton({
  variant,
  width,
  height,
  className = "",
}: SkeletonProps) {
  const customWidth = width ? (typeof width === "number" ? `${width}px` : width) : "";
  const customHeight = height
    ? typeof height === "number"
      ? `${height}px`
      : height
    : "";

  return (
    <div
      role="status"
      aria-label="Sedang memuat"
      className={`animate-shimmer ${variantStyles[variant]} ${className}`}
      style={{
        backgroundColor: "var(--c-line)",
        ...(customWidth && { width: customWidth }),
        ...(customHeight && { height: customHeight }),
      }}
    >
      <span className="sr-only">Sedang memuat...</span>
    </div>
  );
}
