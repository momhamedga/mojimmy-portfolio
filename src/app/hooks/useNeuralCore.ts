"use client";
import { useEffect, useRef } from "react";
import { useTimeTheme } from "../components/Layouts/TimeAwareProvider";

export function useNeuralCore(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const { mode } = useTimeTheme(); // مراقبة تغير الوقت
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<any[]>([]);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // جلب الألوان الحقيقية من الـ CSS Variables
    const getThemeColors = () => {
      const style = getComputedStyle(document.body);
      return {
        primary: style.getPropertyValue('--color-primary').trim() || '#6366f1',
        background: style.getPropertyValue('--color-background').trim() || '#020202'
      };
    };

    let theme = getThemeColors();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      initParticles();
    };

    const initParticles = () => {
      const count = window.innerWidth < 768 ? 40 : 100; // تقليل العدد للموبايل لرفع الـ FPS
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5
      }));
    };

    const draw = () => {
      // تنظيف الشاشة مع الحفاظ على الشفافية للـ Noise خلفها
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        // Mouse Attraction (تأثير مغناطيسي خفيف)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x += dx * 0.01;
          p.y += dy * 0.01;
        }

        // رسم النود (Node)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme.primary;
        ctx.globalAlpha = 0.4;
        ctx.fill();

        // رسم التوصيلات (Connections)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const distance = Math.sqrt(cdx * cdx + cdy * cdy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = theme.primary;
            ctx.globalAlpha = (1 - distance / 120) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [mode]); // إعادة التشغيل فقط عند تغير المود لتحديث الألوان
}