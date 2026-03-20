"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // 1. استدعاء الـ Hooks دايماً هنا (فوق خالص) وبدون أي شروط (if)
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // انقل الـ useTransform من الـ return لهنا:
  const leftPos = useTransform(scaleX, (s) => `${s * 100}%`);
  // افترضنا إن عندك متغير اسمه color و blurValue معرفين فوق
  // const shadow = useTransform(color, (c) => `0px 0px 15px 2px ${c}`);
  const opacityVal = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  // هنا بنعرف لو الموبايل عشان نستخدمها تحت في الـ return بس
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* الخط الأساسي للـ Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 origin-left z-[99999] h-1 bg-purple-500"
        style={{ scaleX }}
      />

      {/* النقطة القائدة - اللي كانت مسببة المشكلة */}
      {!isMobile && (
        <motion.div
          className="fixed top-0 z-[100001] w-1 h-3 pointer-events-none rounded-full bg-white shadow-[0_0_15px_white]"
          style={{
            left: leftPos,    // استخدمنا المتغير اللي عرفناه فوق
            opacity: opacityVal // استخدمنا المتغير اللي عرفناه فوق
          }}
        />
      )}
    </>
  );
}