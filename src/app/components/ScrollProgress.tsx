"use client"
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

export default function ScrollProgress() {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 1. تعريف الـ Hooks الأساسية في المستوى الأعلى دائماً
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001
  });

  const color = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#3b82f6", "#a855f7", "#ec4899"]
  );

  // 2. حل مشكلة الـ Hooks المشروطة: استخراجها للمستوى الأعلى
  // حتى لو لم نستخدمها في الموبايل، يجب أن يتم استدعاؤها
  const leadLeft = useTransform(scaleX, (s) => `${s * 100}%`);
  const leadShadow = useTransform(color, (c) => `0px 0px 15px 2px ${c}`);
  const leadOpacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  // حسابات الحجم والتوهج
  const height = useTransform(scrollVelocity, [-1, 0, 1], [isMobile ? 3 : 6, isMobile ? 2 : 3, isMobile ? 3 : 6]);
  const blurValue = useTransform(scrollVelocity, [-1, 0, 1], [isMobile ? 8 : 15, 4, isMobile ? 8 : 15]);
  const mainShadow = useTransform(color, (c) => isMobile ? `0px 0px 8px ${c}` : `0px 0px 15px ${c}`);

  return (
    <>
      {/* الخط الأساسي */}
      <motion.div
        className="fixed top-0 left-0 right-0 origin-left z-[100000] pointer-events-none"
        style={{ 
          scaleX,
          height, 
          backgroundColor: color,
          boxShadow: mainShadow
        }}
      />
      
      {/* تأثير التوهج */}
      <motion.div
        className="fixed top-0 left-0 right-0 origin-left z-[99999] pointer-events-none opacity-40"
        style={{ 
          scaleX,
          height: useTransform(height, (h) => (Number(h) * 3)), 
          backgroundColor: color,
          filter: useTransform(blurValue, (b) => `blur(${b}px)`),
          opacity: isMobile ? 0.3 : 0.5
        }}
      />

      {/* النقطة القائدة - الشرط هنا فقط على الـ JSX وليس على الـ Hooks */}
      {!isMobile && (
        <motion.div
          className="fixed top-0 z-[100001] w-1 h-3 pointer-events-none rounded-full bg-white shadow-white"
          style={{
            left: leadLeft,
            boxShadow: leadShadow,
            opacity: leadOpacity
          }}
        />
      )}
    </>
  );
}