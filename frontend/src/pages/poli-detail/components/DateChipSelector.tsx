import { format } from "date-fns";
import { motion } from "framer-motion";
import { useMemo } from "react";

const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

interface DateChipProps {
  date: Date;
  isSelected: boolean;
  onClick: () => void;
}

function DateChip({ date, isSelected, onClick }: DateChipProps) {
  const dayName = dayNames[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = monthNames[date.getMonth()];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: isSelected ? 1 : 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-input min-w-[80px] transition-all duration-150"
      style={{
        backgroundColor: isSelected ? "var(--color-primary)" : "var(--color-surface)",
        color: isSelected ? "var(--color-surface)" : "var(--color-text-primary)",
        border: isSelected ? "none" : "2px solid var(--color-border)",
        boxShadow: isSelected ? "0 4px 12px rgba(15, 155, 142, 0.3)" : "none",
      }}
    >
      <span className="text-sm font-medium">{dayName}</span>
      <span className="text-lg font-bold">{dayNumber}</span>
      <span className="text-xs opacity-80">{monthName.slice(0, 3)}</span>
    </motion.button>
  );
}

export function DateChipSelector({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 7 days starting from today
  const dates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [today]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        Pilih Tanggal
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
        {dates.map((date) => (
          <DateChip
            key={date.toISOString()}
            date={date}
            isSelected={format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")}
            onClick={() => onDateChange(date)}
          />
        ))}
      </div>
    </div>
  );
}