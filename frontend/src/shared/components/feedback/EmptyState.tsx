import { type ReactNode } from "react";
import { Button } from "../ui/Button";
import { Search, Plus, Inbox } from "lucide-react";

export interface EmptyStateProps {
  icon?: "search" | "inbox" | "plus" | ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "accent";
  };
  className?: string;
}

const IconComponents = {
  search: Search,
  inbox: Inbox,
  plus: Plus,
};

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const IconComponent = typeof icon === "string" ? IconComponents[icon as keyof typeof IconComponents] : null;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-10 text-center ${className}`}
    >
      {IconComponent && (
        <div className="w-16 h-16 bg-text-secondary/10 rounded-full flex items-center justify-center">
          <IconComponent className="w-8 h-8 text-text-secondary" />
        </div>
      )}
      {typeof icon === "object" && (
        <div className="w-16 h-16 bg-text-secondary/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-h3 text-text-primary mb-2">{title}</h3>
        {description && (
          <p className="text-body text-text-secondary max-w-md">{description}</p>
        )}
      </div>
      {action && (
        <Button
          variant={action.variant || "primary"}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}