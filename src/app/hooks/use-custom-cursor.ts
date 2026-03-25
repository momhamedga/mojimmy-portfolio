"use client"
import { useEffect, useState, startTransition, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export const useCustomCursor = () => {
  // 1. استخدام Lazy Initialization لمنع التحديث المتزامن عند التحميل
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? (window.innerWidth < 768 || 'ontouchstart' in window) : false
  );
  
  const [isVisible, setIsVisible] = useState(false);
  const [hoverState, setHoverState] = useState({ active: false, text: "" });

  // 2. استخدام useRef لتتبع الحالة بدون Re-renders بلا داعي
  const rafId = useRef<number | null>(null);
  const isVisibleRef = useRef(false);

  // Motion Values للتحديث اللحظي (بتقرأ من الـ Mouse مباشرة)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // إعدادات الفيزياء (Spring Physics)
  const springConfig = { stiffness: 800, damping: 45, mass: 0.1 };
  const trailConfig = { stiffness: 150, damping: 25, mass: 0.6 };

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);
useEffect(() => {
    // 1. إخفاء الماوس الأصلي
    if (!isMobile) document.body.style.cursor = 'none';

    // 2. حل مشكلة الخط الأحمر: نحدث الـ Mounted في الفريم القادم
    const rafInitial = requestAnimationFrame(() => {
      setMounted(true);
    });

    const handleMove = (e: MouseEvent) => {
      rafId.current = window.requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
      });
    };

    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .project-card, .group');
      
      startTransition(() => {
        if (interactive) {
          const isProject = interactive.classList.contains('project-card');
          setHoverState(prev => 
            prev.active && prev.text === (isProject ? "VIEW" : "") 
            ? prev 
            : { active: true, text: isProject ? "VIEW" : "" }
          );
        } else {
          setHoverState(prev => !prev.active ? prev : { active: false, text: "" });
        }
      });
    };

    const onResize = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
      document.body.style.cursor = mobile ? 'auto' : 'none';
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleInteraction, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafInitial); // تنظيف الـ Frame الأولي
      if (rafId.current) window.cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleInteraction);
      window.removeEventListener("resize", onResize);
      document.body.style.cursor = 'auto';
    };
  }, [isMobile, mouseX, mouseY]);

  return { mounted, isVisible, isMobile, hoverState, x, y, trailX, trailY };
};