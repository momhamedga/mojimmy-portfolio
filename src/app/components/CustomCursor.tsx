"use client"
import { useEffect, useState, useCallback, useRef, startTransition } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // قيم الحركة الأساسية (بدون الربيع لسرعة الاستجابة الأولية)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // إعدادات الربيع (Spring) - محسنة للموبايل لتقليل الجهد
  const springConfig = { stiffness: 500, damping: 40, mass: 0.5 };
  const mainX = useSpring(mouseX, springConfig);
  const mainY = useSpring(mouseY, springConfig);

  // ذيل واحد فقط للموبايل لتقليل الـ Layers
  const trailX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const trailY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    setMounted(true);

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = "clientX" in e ? e.clientX : (e as TouchEvent).touches[0].clientX;
      const y = "clientY" in e ? e.clientY : (e as TouchEvent).touches[0].clientY;
      
      mouseX.set(x);
      mouseY.set(y);

      if (!isVisible) setIsVisible(true);
    };

    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectCard = target.closest('.project-card');
      const isAction = target.closest('a, button, .group');
      
      startTransition(() => {
        if (projectCard) {
          setIsHovered(true);
          setHoverText("استكشف");
        } else if (isAction) {
          setIsHovered(true);
          setHoverText("");
        } else {
          setIsHovered(false);
          setHoverText("");
        }
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleInteraction);
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseover", handleInteraction);
      window.removeEventListener("resize", checkDevice);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="will-change-auto"
          >
            {/* الذيل - مع تقليل الجودة للموبايل لزيادة الأداء */}
            <motion.div
              className="fixed top-0 left-0 rounded-full bg-primary/20 blur-[6px] will-change-transform"
              style={{
                x: trailX,
                y: trailY,
                translateX: "-50%",
                translateY: "-50%",
                width: isMobile ? 40 : 25,
                height: isMobile ? 40 : 25,
              }}
            />

            {/* الجسم الرئيسي للكرسر */}
            <motion.div
              style={{ 
                x: mainX, 
                y: mainY, 
                translateX: "-50%", 
                translateY: "-50%",
              }}
              className="fixed top-0 left-0 flex items-center justify-center mix-blend-difference will-change-transform"
            >
              <motion.div
                animate={{
                  width: isHovered ? (isMobile ? 70 : 100) : (isMobile ? 0 : 16),
                  height: isHovered ? (isMobile ? 70 : 100) : (isMobile ? 0 : 16),
                  borderRadius: isHovered ? "20%" : "50%",
                  backgroundColor: isHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,1)",
                }}
                className="border border-white/30 flex items-center justify-center backdrop-blur-[4px]"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {isHovered && hoverText && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[11px] font-bold text-white tracking-tighter"
                  >
                    {hoverText}
                  </motion.span>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}