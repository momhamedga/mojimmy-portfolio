"use client";
import { useRef } from "react";

interface OptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/**
 * خيار خطوة داخل المودال.
 *
 * إتاحة (Phase 4): كان الاختيار مرئيًا فقط — قارئ الشاشة ما كانش يعرف
 * أي خيار مُنتقى. بقى `<button>` أصلي بـ`aria-pressed`.
 *
 * ليه button مش radio؟ لأن اختيار الخيار **ينقل للخطوة التالية فورًا**،
 * فهو إجراء تنقّل لا حقل نموذج. مع radio كانت أسهم الكيبورد هتغيّر الاختيار
 * وتقفز للخطوة التالية مع كل ضغطة، فيستحيل تصفّح الخيارات بالكيبورد.
 * (§40 بيسمح بالأزرار صراحةً في حالة خيارات التنقّل.)
 *
 * كل الحركات بقت CSS فبتحترم prefers-reduced-motion من الطبقة العامة.
 */
export const StepOption = ({ label, selected, onClick }: OptionProps) => {
  const isProcessing = useRef(false);

  const handleSafeClick = () => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    onClick();
    setTimeout(() => {
      isProcessing.current = false;
    }, 400);
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={handleSafeClick}
      className={`w-full text-right p-6 rounded-[1.8rem] border transition-all duration-500 relative overflow-hidden active:scale-[0.98] ${
        selected
          ? "text-foreground border-primary shadow-2xl"
          : "border-border-strong bg-foreground/[0.02] text-foreground-dim hover:border-primary/50 hover:bg-foreground/[0.04] hover:text-foreground"
      }`}
      style={
        selected
          ? { backgroundColor: "color-mix(in oklch, var(--color-primary) 10%, transparent)" }
          : undefined
      }
    >
      <span className="flex items-center justify-between relative z-10">
        {/* مؤشر بصري — الحالة الحقيقية معلنة عبر aria-pressed */}
        <span
          aria-hidden="true"
          className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
            selected
              ? "bg-primary scale-125 shadow-[0_0_12px_var(--color-primary)]"
              : "bg-foreground/20"
          }`}
        />

        <span
          className={`font-cairo font-bold text-base tracking-tight transition-transform duration-500 ${
            selected ? "translate-x-1" : ""
          }`}
        >
          {label}
        </span>
      </span>
    </button>
  );
};
