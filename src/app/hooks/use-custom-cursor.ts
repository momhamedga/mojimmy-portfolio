"use client";
import { useEffect, useState, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * شرط التفعيل: جهاز تأشير دقيق **و** قادر على الـhover **و** المستخدم لم يطلب
 * تقليل الحركة. إخفاء مؤشر النظام لمستخدم طالب تقليل الحركة أو يعمل باللمس
 * ضرر إتاحة صافٍ (Phase 4 · §20).
 */
const CURSOR_QUERY =
  "(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)";

/**
 * مؤشر الفأرة المخصّص.
 *
 * تحسينات Phase 3:
 * - كشف الجهاز بقى بـ matchMedia("(pointer: fine)") بدل
 *   `innerWidth < 768 || 'ontouchstart' in window` — ده الفرق الحقيقي: تابلت
 *   بشاشة عريضة ولمس ما يتحسبش ديسكتوب، والعكس. والتغيير عبر listener بدل
 *   إعادة تركيب كل المستمعين مع كل resize.
 * - الـ effect ما بقاش يعتمد على قياس الشاشة، فمفيش إعادة تسجيل للمستمعين.
 * - rAF بقى محروسًا: frame واحد معلّق كحد أقصى، بدل جدولة frame جديد مع كل
 *   حدث mousemove (كان بيكدّس عشرات الـ callbacks أثناء الحركة السريعة).
 * - حالة الـ hover بتتحدّث بس لما تتغيّر فعلًا (مقارنة بـ ref قبل setState).
 */
export const useCustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverState, setHoverState] = useState({ active: false, text: "" });

  const rafId = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const hoverRef = useRef({ active: false, text: "" });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, { stiffness: 800, damping: 45, mass: 0.1 });
  const y = useSpring(mouseY, { stiffness: 800, damping: 45, mass: 0.1 });
  const trailX = useSpring(mouseX, { stiffness: 150, damping: 25, mass: 0.6 });
  const trailY = useSpring(mouseY, { stiffness: 150, damping: 25, mass: 0.6 });

  // تفعيل/تعطيل حسب نوع جهاز التأشير — بلا أي علاقة بعرض الشاشة
  useEffect(() => {
    const mql = window.matchMedia(CURSOR_QUERY);
    const apply = () => setEnabled(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.body.style.cursor = "none";

    const flush = () => {
      rafId.current = null;
      mouseX.set(pointer.current.x);
      mouseY.set(pointer.current.y);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMove = (e: MouseEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      if (rafId.current === null) rafId.current = requestAnimationFrame(flush);
    };

    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, .project-card, .group");
      const active = Boolean(interactive);
      const text = interactive?.classList.contains("project-card") ? "VIEW" : "";

      if (hoverRef.current.active === active && hoverRef.current.text === text) return;
      hoverRef.current = { active, text };
      setHoverState({ active, text });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleInteraction, { passive: true });

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleInteraction);
      document.body.style.cursor = "auto";
    };
  }, [enabled, mouseX, mouseY]);

  return { enabled, isVisible, hoverState, x, y, trailX, trailY };
};
