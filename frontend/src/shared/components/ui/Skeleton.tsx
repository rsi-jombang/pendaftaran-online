export interface SkeletonProps {
  variant: "text" | "card" | "avatar" | "button";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ variant, width, height, className = "" }: SkeletonProps) {
  const baseStyles = "animate-pulse bg-border rounded";

  const variantStyles = {
    text: "h-4 w-full rounded",
    card: "h-48 w-full rounded-card",
    avatar: "h-12 w-12 rounded-full",
    button: "h-12 w-32 rounded-input",
  };

  const customWidth = width ? (typeof width === "number" ? `${width}px` : width) : "";
  const customHeight = height ? (typeof height === "number" ? `${height}px` : height) : "";

  const style = {
    ...(customWidth && { width: customWidth }),
    ...(customHeight && { height: customHeight }),
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
