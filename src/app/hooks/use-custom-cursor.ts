"use client"
import { useEffect, useState, startTransition } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export const useCustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverState, setHoverState] = useState({ active: false, text: "" });
  const [isMobile, setIsMobile] = useState(false);

  // Motion Values للتحديث اللحظي بدون Re-renders
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // إعدادات الربيع (Spring Physics)
  const springConfig = { stiffness: 800, damping: 45, mass: 0.1 };
  const trailConfig = { stiffness: 150, damping: 25, mass: 0.6 };

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
      if (!mobile) document.body.style.cursor = 'none';
    };

    checkDevice();
    setMounted(true);

    let rafId: number;
    const handleMove = (e: MouseEvent) => {
      rafId = window.requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (!isVisible) setIsVisible(true);
      });
    };

    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .project-card, .group');
      
      startTransition(() => {
        if (interactive) {
          const isProject = interactive.classList.contains('project-card');
          setHoverState({ active: true, text: isProject ? "VIEW" : "" });
        } else {
          setHoverState({ active: false, text: "" });
        }
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleInteraction, { passive: true });
    window.addEventListener("resize", checkDevice);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleInteraction);
      window.removeEventListener("resize", checkDevice);
      document.body.style.cursor = 'auto';
    };
  }, [mouseX, mouseY, isVisible]);

  return { mounted, isVisible, isMobile, hoverState, x, y, trailX, trailY };
};