import { motion } from "framer-motion";
import { Badge } from "../../../shared/components/ui/Badge";
import type { PendingSelection } from "../../../shared/store/registrationFlowStore";

interface SelectionSummaryChipProps {
  selection: PendingSelection;
}

export function SelectionSummaryChip({ selection }: SelectionSummaryChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 p-4 rounded-input"
      style={{ backgroundColor: "var(--color-primary-light)", border: "1px solid var(--color-primary)" }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Ringkasan:</span>
        <Badge status="info" className="px-3 py-1">
          {selection.poliName}
        </Badge>
        <Badge status="info" className="px-3 py-1">
          {selection.doctorName}
        </Badge>
        <Badge status="info" className="px-3 py-1">
          {formatDateDisplay(selection.date)} · {selection.practiceHours}
        </Badge>
      </div>
    </motion.div>
  );
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}