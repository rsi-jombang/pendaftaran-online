import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface DateChipProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}

function DateChip({ date, isSelected, isToday, onClick }: DateChipProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={isSelected ? {} : { scale: 1.04 }}
      onClick={onClick}
      className={`relative flex shrink-0 flex-col items-center gap-0.5 rounded-input px-4 py-3 min-w-[76px] transition-colors duration-150 ${
        isSelected ? "text-white" : ""
      }`}
      style={{
        backgroundColor: isSelected ? "var(--color-primary)" : "var(--c-surface)",
        color: isSelected ? "#ffffff" : "var(--c-text)",
        border: isSelected ? "none" : "2px solid var(--c-line)",
        boxShadow: isSelected ? "var(--shadow-soft)" : "none",
      }}
    >
      <span className="text-xs font-medium uppercase tracking-wide opacity-80">
        {format(date, "EEE", { locale: localeId })}
      </span>
      <span className="text-xl font-bold leading-none">{date.getDate()}</span>
      <span className="text-[11px] opacity-75">
        {format(date, "MMM", { locale: localeId })}
      </span>

      {/* Dot penanda hari ini */}
      {isToday && (
        <span
          className="absolute bottom-1.5 h-1 w-1 rounded-full"
          style={{
            backgroundColor: isSelected ? "#ffffff" : "var(--color-accent)",
          }}
        />
      )}
    </motion.button>
  );
}

interface DateChipSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateChipSelector({
  selectedDate,
  onDateChange,
}: DateChipSelectorProps) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Generate 7 hari ke depan mulai hari ini
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, [today]);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="relative">
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-3 -mx-6 px-6">
        {dates.map((date) => (
          <DateChip
            key={date.toISOString()}
            date={date}
            isToday={sameDay(date, today)}
            isSelected={sameDay(date, selectedDate)}
            onClick={() => onDateChange(date)}
          />
        ))}
      </div>

      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10"
        style={{ background: "linear-gradient(to right, var(--c-bg), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10"
        style={{ background: "linear-gradient(to left, var(--c-bg), transparent)" }}
      />
    </div>
  );
}