import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface QueueNumberDisplayProps {
  queueNumber: string;
  status: "waiting" | "in_service" | "done";
  estimatedWaitMinutes?: number;
}

export function QueueNumberDisplay({
  queueNumber,
  status,
  estimatedWaitMinutes = 0,
}: QueueNumberDisplayProps) {
  // Countdown state
  const [countdown, setCountdown] = useState(() => estimatedWaitMinutes * 60);

  useEffect(() => {
    if (status !== "waiting" || estimatedWaitMinutes <= 0) return;

    setCountdown(estimatedWaitMinutes * 60);

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [status, estimatedWaitMinutes]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedCountdown = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const statusConfig = {
    waiting: {
      color: "var(--c-warning)",
      glow: "var(--c-warning)",
      label: "Menunggu Panggilan",
    },
    in_service: {
      color: "var(--c-secondary)",
      glow: "var(--c-secondary)",
      label: "Sedang Dilayani",
    },
    done: {
      color: "var(--c-success)",
      glow: "var(--c-success)",
      label: "Selesai",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Checkmark with radial glow */}
      <div className="relative">
        {/* Radial glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 -m-4"
          style={{
            background: `radial-gradient(circle at center, ${config.glow}20 0%, transparent 70%)`,
          }}
        />

        <motion.svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.2 }}
          className="relative z-10"
        >
          {/* Outer ring with status color */}
          <motion.circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke={config.color}
            strokeWidth="3"
            opacity={0.2}
          />
          <motion.circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke={config.color}
            strokeWidth="3"
            strokeDasharray="264"
            initial={{ strokeDashoffset: 264 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />

          {/* Checkmark path */}
          <motion.path
            d="M28 48 L42 62 L68 36"
            fill="none"
            stroke={config.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          />

          {/* Inner glow circle */}
          <motion.circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke={config.color}
            strokeWidth="1"
            opacity={0.15}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          />
        </motion.svg>
      </div>

      {/* Queue Number - Display Font */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.6 }}
        className="text-center"
      >
        <span
          className="block font-bold tracking-tight"
          style={{
            fontFamily: "'Space Grotesk', 'JetBrains Mono', monospace",
            fontSize: "clamp(56px, 12vw, 110px)",
            lineHeight: 1.1,
            color: "var(--c-text)",
          }}
        >
          {queueNumber}
        </span>
      </motion.div>

      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center gap-2"
      >
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-small font-medium"
          style={{
            backgroundColor: `color-mix(in srgb, ${config.color} 12%, transparent)`,
            color: config.color,
            border: `2px solid color-mix(in srgb, ${config.color} 25%, transparent)`,
          }}
        >
          {status === "waiting" && (
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: config.color,
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
          )}
          {config.label}
        </span>

        {/* Countdown for waiting status */}
        {status === "waiting" && estimatedWaitMinutes > 0 && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-2 text-small"
            style={{ color: "var(--c-text-muted)" }}
          >
            <span>Estimasi:</span>
            <span
              className="rounded-md px-2.5 py-1 font-mono font-medium tabular-nums"
              style={{
                backgroundColor: "var(--c-line)",
                color: config.color,
              }}
            >
              {formattedCountdown}
            </span>
          </motion.div>
        )}
      </motion.div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}