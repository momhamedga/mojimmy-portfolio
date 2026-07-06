"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  target?: number;
  prefix?: string;
  display?: string;
}

const STATS: StatItem[] = [
  { target: 50, prefix: "+", label: "مشروع مكتمل" },
  { target: 5, prefix: "+", label: "سنوات خبرة" },
  { display: "24/7", label: "دعم فني" },
];

const Counter = ({ target, prefix }: { target: number; prefix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{value}
    </span>
  );
};

export const HeroContent = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto">

      {/* البادج العائم */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border bg-surface backdrop-blur-md mb-8 shadow-sm"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]" />
        <span className="text-foreground-dim font-cairo text-[10px] md:text-xs uppercase tracking-[0.25em] font-black">
          نطور الأفكار لمشاريع واقعية
        </span>
      </motion.div>

      {/* العنوان الرئيسي */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.4] md:leading-tight tracking-normal font-cairo text-balance"
      >
        نصنع <span className="text-foreground/40">واقعاً</span> <br className="hidden md:block" />
        <motion.span
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto]"
        >
          رقمياً مذهلاً.
        </motion.span>
      </motion.h1>

      {/* وصف قصير */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="max-w-lg mt-5 text-foreground-dim text-sm md:text-lg font-cairo font-light leading-relaxed px-4"
      >
        نحول التعقيد البرمجي إلى بساطة بصرية، نصمم
        <span className="text-foreground mx-2 font-medium underline decoration-accent/40 underline-offset-8">أنظمة حية</span>
        تتنفس ابتكاراً.
      </motion.p>

      {/* شريط الإحصائيات الزجاجي */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.8 }}
        className="glass-light mt-9 flex items-stretch gap-1 rounded-2xl p-1.5"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center px-5 sm:px-7 py-3 ${i > 0 ? "border-r border-border" : ""}`}
          >
            <span className="text-lg sm:text-2xl font-black font-cairo text-primary tabular-nums">
              {stat.display ?? <Counter target={stat.target!} prefix={stat.prefix!} />}
            </span>
            <span className="text-[9px] sm:text-[10px] text-foreground-dim font-cairo font-bold uppercase tracking-wide whitespace-nowrap">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
