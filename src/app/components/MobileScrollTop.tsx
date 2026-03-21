"use client"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState, useCallback } from "react";

export default function MobileScrollTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // تحسين الأداء: مراقبة الحركة بذكاء
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // شروط الظهور: 
    // 1. تجاوز مسافة 400px
    // 2. الفرق بين الموقع الحالي والسابق أكبر من 10px (لتجنب الحساسية المفرطة)
    const isScrollingUp = latest < previous - 10;
    
    if (latest > 400 && isScrollingUp) {
      if (!visible) setVisible(true);
    } else if (latest <= 400 || !isScrollingUp) {
      if (visible) setVisible(false);
    }
  });

  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          // تعريف الـ Animation بأداء عالٍ
          initial={{ opacity: 0, y: 30, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          
          // تحسين الشكل ليتناسب مع الهوية البصرية (Purple & Dark)
          className="fixed bottom-28 left-6 w-12 h-12 rounded-2xl bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 text-white flex items-center justify-center z-[90] lg:hidden shadow-[0_20px_40px_rgba(168,85,247,0.15)] overflow-hidden"
          style={{ 
            touchAction: 'none',
            willChange: 'transform, opacity' // تنبيه المتصفح لتحسين الأداء
          }}
        >
          {/* خلفية نيون خفيفة جداً داخل الزر */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />
          
          <ArrowUp size={20} className="text-purple-400 relative z-10" />
          
          {/* تأثير لمعة سريع عند الظهور */}
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "200%" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="absolute top-0 w-1/2 h-full bg-white/5 skew-x-[30deg]"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}