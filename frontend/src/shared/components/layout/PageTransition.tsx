import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.16, 1, 0.3, 1] as const,
  duration: 0.3,
};

export function PageTransition() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={window.location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}