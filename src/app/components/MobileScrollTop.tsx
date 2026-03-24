"use client"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState, useCallback, useRef } from "react";

export default function MobileScrollTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  // منطق الظهور الذكي: يظهر فقط عند الصعود لأعلى وبعد مسافة معينة
  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrollingUp = latest < lastScrollY.current - 15; // زيادة الحساسية لـ 15px
    
    if (latest > 500 && isScrollingUp) {
      if (!visible) setVisible(true);
    } else if (latest <= 500 || !isScrollingUp) {
      if (visible) setVisible(false);
    }
    lastScrollY.current = latest;
  });

  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      // Haptic Feedback: اهتزاز خفيف جداً عند الضغط (إحساس بريميوم)
      if (navigator.vibrate) navigator.vibrate([10]);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.3, y: 20, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.85 }}
          onClick={scrollToTop}
          
          // التصميم: معايير Ultra-Dark & Glassmorphism
          className="fixed bottom-10 left-6 w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center z-[100] lg:hidden shadow-[0_0_30px_rgba(168,85,247,0.2)] active:border-purple-500/50 transition-colors"
          style={{ 
            willChange: 'transform, opacity',
            touchAction: 'manipulation' // تحسين استجابة اللمس ومنع الـ Zoom
          }}
        >
          {/* تأثير توهج داخلي (Inner Glow) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-white/5 opacity-50" />
          
          {/* أيقونة السهم مع أنيميشن بسيط */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowUp size={24} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </motion.div>

          {/* تأثير اللمعة (Shine Effect) */}
          <motion.div 
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
            className="absolute top-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}