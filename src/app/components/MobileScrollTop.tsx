"use client"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState, useCallback, useRef } from "react";

export default function MobileScrollTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  
  // استخدام Refs لتخزين القيم اللحظية بدون ريندر
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // تحديد اتجاه السكرول والحساسية
    const direction = latest < lastScrollY.current - 15;
    
    // منطق الظهور: سكرول أكتر من 500 بيكسل + بيطلع لفوق
    if (latest > 500 && direction) {
      if (!visible) setVisible(true);
    } 
    // الاختفاء: نزل لتحت أو رجع لأول الصفحة
    else {
      if (visible) setVisible(false);
    }
    
    lastScrollY.current = latest;
  });

  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      if (navigator.vibrate) navigator.vibrate(10); // Haptic Feedback سريع
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="الرجوع لأعلى الصفحة"
          className="fixed bottom-10 left-6 w-14 h-14 rounded-2xl bg-surface/70 backdrop-blur-xl border border-border text-foreground flex items-center justify-center z-100 lg:hidden shadow-lg shadow-primary/10 active:border-primary/50"
          style={{
            willChange: 'transform, opacity',
            touchAction: 'manipulation'
          }}
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-40 rounded-2xl" />

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowUp size={24} className="text-primary" style={{ filter: "drop-shadow(0 0 5px color-mix(in oklch, var(--color-primary) 50%, transparent))" }} />
          </motion.div>

          {/* Shine Ray */}
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "200%" }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute top-0 w-8 h-full bg-foreground/5 skew-x-25 blur-sm"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}