import { Check } from "lucide-react";

export interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-small font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-surface border-2 border-border text-text-secondary"
                }`}
              >
                {isCompleted ? <Check size={20} /> : stepNumber}
              </div>
              <span
                className={`text-small text-center max-w-[80px] ${
                  isCurrent ? "text-text-primary font-medium" : "text-text-secondary"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
