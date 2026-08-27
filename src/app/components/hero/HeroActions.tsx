"use client";

import { useRef } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

/**
 * جزيرة عميل: أزرار الـ Hero.
 *
 * الدعوة الأساسية كانت تفتح مودال طلب مشروع من ثلاث خطوات (خدمة، ميزانية،
 * بريد ورسالة) ثم تُرسل عبر نفس `submitContactForm`. أُزيل المودال: الرحلة
 * بقت الدعوة ← قسم التواصل مباشرةً، بخطوة واحدة بدل أربع.
 *
 * العنصر بقى `<a href="#contact">` لا `<button>`: الوجهة صفحة لا إجراء، فالرابط
 * يعمل بلا JavaScript، ويحترم فتح تبويب جديد، ويظهر في تنقّل الروابط.
 *
 * أثر التمرير (`--x`/`--y`) باقٍ كما هو — مظهر الزر لم يتغيّر بأي بكسل.
 */
export const HeroActions = () => {
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ctaRef.current;
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
      <a
        ref={ctaRef}
        href="#contact"
        onMouseMove={handleMouseMove}
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
      </a>

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
    </div>
  );
};
