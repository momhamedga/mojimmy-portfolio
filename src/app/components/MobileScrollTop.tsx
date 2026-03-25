"use client"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState, useCallback, useRef } from "react";

export default function MobileScrollTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  
  // استخدام Refs لتخزين القيم اللحظية بدون ريندر
  const lastScrollY = useRef(0);
  const isScrollingUpRef = useRef(false);

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
          className="fixed bottom-10 left-6 w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center z-[100] lg:hidden shadow-[0_0_30px_rgba(168,85,247,0.2)] active:border-purple-500/50"
          style={{ 
            willChange: 'transform, opacity',
            touchAction: 'manipulation' 
          }}
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-transparent opacity-40 rounded-2xl" />
          
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowUp size={24} className="text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
          </motion.div>

          {/* Shine Ray */}
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "200%" }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute top-0 w-8 h-full bg-white/5 skew-x-[25deg] blur-sm"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}