import { motion } from "framer-motion";

interface QueueNumberDisplayProps {
  queueNumber: string;
  status: "waiting" | "in_service" | "done";
}

export function QueueNumberDisplay({ queueNumber, status }: QueueNumberDisplayProps) {
  const pulseStyle = status === "waiting" ? {
    animation: "pulse 2s infinite",
  } : {};

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Checkmark Draw-on Animation */}
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="text-primary"
        >
          <motion.path
            d="M16 40 L32 56 L64 24"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-20"
          />
        </motion.svg>

        {/* Queue Number - Font Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
          style={{ fontFamily: "'Space Grotesk', 'JetBrains Mono', monospace" }}
        >
          <span
            className="font-bold"
            style={{
              fontSize: "clamp(64px, 12vw, 120px)",
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {queueNumber}
          </span>
        </motion.div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor:
                status === "waiting"
                  ? "rgba(245, 166, 35, 0.15)"
                  : status === "in_service"
                  ? "rgba(59, 130, 196, 0.15)"
                  : "rgba(34, 163, 102, 0.15)",
              color:
                status === "waiting"
                  ? "var(--color-warning)"
                  : status === "in_service"
                  ? "var(--color-secondary)"
                  : "var(--color-success)",
              border:
                status === "waiting"
                  ? "2px solid rgba(245, 166, 35, 0.3)"
                  : status === "in_service"
                  ? "2px solid rgba(59, 130, 196, 0.3)"
                  : "2px solid rgba(34, 163, 102, 0.3)",
            }}
          >
            {status === "waiting" && (
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--color-warning)",
                  ...pulseStyle,
                }}
              />
            )}
            {status === "waiting"
              ? "Menunggu Panggilan"
              : status === "in_service"
              ? "Sedang Dilayani"
              : "Selesai"}
          </span>
        </motion.div>
      </motion.div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}