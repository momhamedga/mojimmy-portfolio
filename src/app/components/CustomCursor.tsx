"use client"
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence, MotionValue } from "framer-motion";

// تعريف الواجهة لضمان توافق الأنواع في TypeScript
interface TailPoint {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [cursorText, setCursorText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  // 1. القيم الأساسية للمدخلات
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 2. حساب الدوران
  const rotation = useTransform(mouseX, (v) => (v * 0.1) % 360);

  // 3. كرسر القائد (الرأس)
  const mainX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const mainY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

  // 4. بناء الذيل الفيزيائي المتسلسل
  const s1 = { x: useSpring(mouseX, { stiffness: 80, damping: 20 }), y: useSpring(mouseY, { stiffness: 80, damping: 20 }) };
  const s2 = { x: useSpring(s1.x, { stiffness: 60, damping: 25 }), y: useSpring(s1.y, { stiffness: 60, damping: 25 }) };
  const s3 = { x: useSpring(s2.x, { stiffness: 40, damping: 30 }), y: useSpring(s2.y, { stiffness: 40, damping: 30 }) };
  const s4 = { x: useSpring(s3.x, { stiffness: 20, damping: 35 }), y: useSpring(s3.y, { stiffness: 20, damping: 35 }) };

  const tails: TailPoint[] = [s1, s2, s3, s4];
  const isVisibleRef = useRef(false);

 useEffect(() => {
    // 1. تعريف الميديا كويري
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    
    // 2. تحديث الحالة داخل requestAnimationFrame لتجنب الـ Cascading Render
    const frame = requestAnimationFrame(() => {
      setIsDesktop(mediaQuery.matches);
      setMounted(true);
    });

    // 3. مستمع لتغيير حجم الشاشة (عشان لو اليوزر صغر المتصفح)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => {
      cancelAnimationFrame(frame);
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    if (!isDesktop) return; // تعطيل التحديثات تماماً في الموبايل
    
    mouseX.set(x);
    mouseY.set(y);
    
    if (!isVisibleRef.current) {
      setIsVisible(true);
      isVisibleRef.current = true;
    }
  }, [mouseX, mouseY, isDesktop]);

  useEffect(() => {
    if (!isDesktop) return; // لا تقم بإضافة Listeners إذا كان موبايل

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX, e.clientY);
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.project-card') || target.closest('.group')) {
        setIsHovered(true);
        setCursorText("استكشف");
      } else if (target.closest('a, button')) {
        setIsHovered(true);
        setCursorText("");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [updatePosition, isDesktop]);

  // منع الريندر إذا لم يتم التحميل أو إذا كان الجهاز موبايل
  if (!mounted || !isDesktop) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-99999 hidden md:block">
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            {/* ذيل السوائل */}
            {tails.map((point, i) => (
              <motion.div
                key={i}
                className="fixed top-0 left-0 rounded-full bg-purple-500/20 blur-[3px]"
                style={{
                  x: point.x,
                  y: point.y,
                  translateX: "-50%",
                  translateY: "-50%",
                  width: 20 - i * 4,
                  height: 20 - i * 4,
                  opacity: 0.8 - i * 0.2,
                }}
              />
            ))}

            {/* الكرسر الرئيسي */}
            <motion.div
              className="fixed top-0 left-0 flex items-center justify-center mix-blend-difference"
              style={{ x: mainX, y: mainY, translateX: "-50%", translateY: "-50%" }}
            >
              <motion.div
                animate={{
                  width: isHovered ? 80 : 12,
                  height: isHovered ? 80 : 12,
                  borderRadius: isHovered ? "20%" : "50%",
                  rotate: isHovered ? 135 : 0
                }}
                className="border border-purple-400/50 flex items-center justify-center overflow-hidden bg-white/5 backdrop-blur-[2px]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {isHovered && cursorText && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-bold text-purple-200 tracking-tighter rotate-[-135deg] whitespace-nowrap"
                  >
                    {cursorText}
                  </motion.span>
                )}
              </motion.div>

              <motion.div 
                animate={{ scale: isHovered ? 0 : 1 }}
                className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" 
              />
            </motion.div>

            {/* خط التشويش */}
            <motion.div
              className="fixed top-0 left-0 w-px h-16 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent"
              style={{
                x: mainX,
                y: mainY,
                translateX: "-50%",
                translateY: "-50%",
                rotate: rotation 
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}