"use client"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export default function MobileScrollTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // يظهر لو المستخدم نزل أكتر من 400px وبدأ "يسحب لفوق" (يعني عايز يرجع)
    if (latest > 400 && latest < previous) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-28 left-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center z-[90] lg:hidden shadow-2xl shadow-purple-500/20"
          style={{ touchAction: 'none' }} // لمنع تداخل حركات التاتش
        >
          <ArrowUp size={20} className="text-purple-400" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}