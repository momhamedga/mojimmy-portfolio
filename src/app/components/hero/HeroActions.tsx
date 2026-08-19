"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, ChevronDown } from "lucide-react";

// المودال يُحمّل عند أول فتح فقط — كود splitting له قيمة مثبتة هنا
// (274 سطر + framer-motion لا يلزم أي زائر لا يضغط الزر).
const StartProjectModal = dynamic(() => import("../ProjectModal/StartProjectModal"), {
  ssr: false,
});

/**
 * جزيرة عميل: أزرار الـ Hero + ملكية حالة المودال.
 * نُقلت حالة المودال من Hero لهنا، فبقى Hero (ومعاه العنوان والنصوص) Server Component.
 */
export const HeroActions = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="enter-rise enter-delay-4 flex flex-col sm:flex-row items-center justify-center gap-3 mt-9 w-full">
      <button
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onClick={() => setIsModalOpen(true)}
        className="group relative px-8 py-3.5 rounded-2xl bg-primary-strong text-white font-black font-cairo overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
      >
        <span className="relative z-10 flex items-center gap-3 text-sm md:text-base tracking-wide">
          ابدأ رحلتك الإبداعية
          <ArrowUpRight
            aria-hidden="true"
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </span>

        {/* تأثير الـ Spot-light النيون */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at var(--x) var(--y), color-mix(in oklch, white 30%, transparent) 0%, transparent 50%)",
          }}
        />
      </button>

      <button
        onClick={scrollToProjects}
        className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl text-foreground-dim hover:text-foreground font-bold font-cairo text-sm md:text-base transition-colors cursor-pointer"
      >
        شاهد أعمالي
        <ChevronDown
          aria-hidden="true"
          size={16}
          className="transition-transform duration-300 group-hover:translate-y-0.5"
        />
      </button>

      {isModalOpen && <StartProjectModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
