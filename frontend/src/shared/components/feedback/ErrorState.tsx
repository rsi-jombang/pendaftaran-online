import { Button } from "../ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  message = "Terjadi kesalahan. Silakan coba lagi.",
  onRetry,
  retryLabel = "Coba Lagi",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-8 text-center ${className}`}
      role="alert"
    >
      <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-danger" />
      </div>
      <div>
        <h3 className="text-h3 text-text-primary mb-2">Oops, Ada Masalah</h3>
        <p className="text-body text-text-secondary max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="primary"
          icon={<RefreshCw size={18} />}
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}