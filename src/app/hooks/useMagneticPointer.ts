"use client";
import { useCallback, useRef } from "react";
import { useSpring, type SpringOptions } from "framer-motion";

/**
 * تتبّع الماوس لتأثير "المغناطيسية" — يجمّع كل الحركة في requestAnimationFrame واحد
 * بدل استدعاء getBoundingClientRect() مع كل حدث mousemove (يمنع Layout Thrash).
 */
export function useMagneticPointer(intensity: number, springConfig: SpringOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    pointerRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      if (!el) return;

      const { height, width, left, top } = el.getBoundingClientRect();
      const middleX = pointerRef.current.x - (left + width / 2);
      const middleY = pointerRef.current.y - (top + height / 2);
      x.set(middleX * intensity);
      y.set(middleY * intensity);
    });
  }, [intensity, x, y]);

  const reset = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, x, y, handleMouseMove, reset };
}
