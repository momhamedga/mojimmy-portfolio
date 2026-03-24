"use client";
import { useEffect } from "react";
import { NEURAL_CONFIG } from "@/src/lib/db";

export function useNeuralCore(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // استخدام alpha: false لتحسين أداء الرندرة (فريمات أكتر)
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;
    
    // حساب الأداء بناءً على عدد الأنوية (Hardware Acceleration Logic)
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const isHighEnd = cores >= 8;
    const optimizedCount = isHighEnd 
      ? NEURAL_CONFIG.particleCount 
      : Math.floor(NEURAL_CONFIG.particleCount * (cores / 12));
    
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // تعريف الجزيئات ببيانات محسنة
    const particles = Array.from({ length: optimizedCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * NEURAL_CONFIG.velocity,
      vy: (Math.random() - 0.5) * NEURAL_CONFIG.velocity,
      size: Math.random() * 1.5 + 1 // أحجام عشوائية بسيطة لواقعية أكتر
    }));

    const draw = () => {
      // تنظيف الشاشة (Background)
      ctx.fillStyle = NEURAL_CONFIG.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      tick += NEURAL_CONFIG.pulseSpeed;
      // تأثير النبض السينمائي
      const pulse = (Math.sin(tick) + 1) / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. تحديث الموقع
        p.x += p.vx;
        p.y += p.vy;

        // 2. تفاعل الماوس (Repulsion Effect)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distMouse = dx * dx + dy * dy; // استخدام التربيع لتجنب Math.sqrt (أسرع)
        const radiusSq = NEURAL_CONFIG.mouseRadius * NEURAL_CONFIG.mouseRadius;

        if (distMouse < radiusSq) {
          const distance = Math.sqrt(distMouse);
          const force = (NEURAL_CONFIG.mouseRadius - distance) / NEURAL_CONFIG.mouseRadius;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }

        // 3. الارتداد من الحواف
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 4. رسم النقطة (Node)
        ctx.fillStyle = pulse > 0.85 ? "#ffffff" : NEURAL_CONFIG.colors.node;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + (pulse * 0.4), 0, Math.PI * 2);
        ctx.fill();

        // 5. رسم الروابط (Connections) - تحسين الـ Loop
        // لو الجهاز ضعيف، بنرسم روابط أقل (Skip connections)
        const step = isHighEnd ? 1 : 2; 
        for (let j = i + step; j < particles.length; j += step) {
          const p2 = particles[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const distSq = ldx * ldx + ldy * ldy;
          const connDistSq = NEURAL_CONFIG.connectionDistance * NEURAL_CONFIG.connectionDistance;
          
          if (distSq < connDistSq) {
            const distance = Math.sqrt(distSq);
            // شفافية ديناميكية بناءً على البعد والنبض
            const opacity = (1 - distance / NEURAL_CONFIG.connectionDistance) * (0.1 + pulse * 0.2); 
            ctx.strokeStyle = `rgba(${NEURAL_CONFIG.colors.line}, ${opacity})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef]);
}