"use client";
import { motion, useScroll, useSpring, useMotionValueEvent, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * شريط تقدّم السكرول.
 *
 * تحسين Phase 3 — كان بيكتب خصائص تسبّب layout مع كل frame:
 *   leader.style.left  = "٪"   → إعادة حساب تخطيط
 *   line.style.height  = "px"  → إعادة حساب تخطيط
 *
 * دلوقتي كله transform/compositing:
 * - النقطة القائدة بتتحرّك بـ translateX عبر متغيّر CSS (بلا layout).
 * - سماكة الخط بقت scaleY على ارتفاع ثابت، فتنضم لنفس الـ transform.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const leaderRef = useRef<HTMLDivElement>(null);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 2px → 4px بالظبط زي الأول، لكن بـ transform بدل height
  const scaleY = useTransform(scaleX, [0, 1], [0.5, 1]);

  useMotionValueEvent(scaleX, "change", (latest) => {
    leaderRef.current?.style.setProperty("--progress", String(latest));
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-99999 pointer-events-none" aria-hidden="true">
      {/* 1. الخط الأساسي (The Glowing Line) */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 origin-top-left bg-linear-to-r from-primary via-accent to-primary"
        style={{
          scaleX,
          scaleY,
          boxShadow: "0 0 20px color-mix(in oklch, var(--color-primary) 40%, transparent)",
        }}
      />

      {/* 2. النقطة القائدة (The Cinematic Leader) */}
      <div
        ref={leaderRef}
        className="scroll-leader absolute top-0 left-0 hidden md:flex flex-col items-center"
      >
        <div className="w-1.5 h-4 bg-white rounded-full shadow-[0_0_15px_2px_#fff]" />
        <div className="w-px h-20 bg-linear-to-b from-white/40 via-white/5 to-transparent" />
      </div>

      {/* 3. خلفية زجاجية خفيفة لتعزيز العمق */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-foreground/3 -z-10" />
    </div>
  );
}
