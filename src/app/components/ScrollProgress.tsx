"use client";
import { useEffect, useRef } from "react";

/**
 * شريط تقدّم السكرول — CSS + `rAF` خالص بدون `framer-motion`.
 *
 * يقرأ نسبة التمرير داخل إطار `requestAnimationFrame` ويحدّث `transform`
 * و`--progress` مباشرة دون إعادة تصيير React ودون فرض إعادة تخطيط.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const leaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const scaleY = 0.5 + progress * 0.5;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress}) scaleY(${scaleY})`;
      }
      if (leaderRef.current) {
        leaderRef.current.style.setProperty("--progress", String(progress));
      }
    };

    const schedule = () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-99999 pointer-events-none" aria-hidden="true">
      {/* 1. الخط الأساسي (The Glowing Line) */}
      <div
        ref={barRef}
        className="absolute top-0 left-0 right-0 h-1 origin-top-left bg-linear-to-r from-primary via-accent to-primary will-change-transform"
        style={{
          transform: "scaleX(0) scaleY(0.5)",
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
