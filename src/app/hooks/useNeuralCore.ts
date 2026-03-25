"use client";
import { useEffect, useRef } from "react";
import { NEURAL_CONFIG } from "@/src/lib/db";

export function useNeuralCore(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  // 1. استخدام Refs للقيم التي تتغير باستمرار لمنع الـ Re-renders وتوفير الذاكرة
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const tickRef = useRef(0);
  const particlesRef = useRef<any[]>([]);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // تحسين الرندرة بـ alpha: false (أسرع بكتير لأن المتصفح مش بيحسب الشفافية للخلفية)
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // 2. Hardware Acceleration Logic
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const isHighEnd = cores >= 8;
    const optimizedCount = isHighEnd 
      ? NEURAL_CONFIG.particleCount 
      : Math.floor(NEURAL_CONFIG.particleCount * (cores / 12));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // إعادة توزيع الجزيئات عند تغيير الحجم لضمان تغطية الشاشة
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // 3. تعريف الجزيئات وتخزينها في Ref
    const initParticles = () => {
      particlesRef.current = Array.from({ length: optimizedCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * NEURAL_CONFIG.velocity,
        vy: (Math.random() - 0.5) * NEURAL_CONFIG.velocity,
        size: Math.random() * 1.5 + 1
      }));
    };

    const draw = () => {
      // Background Clean
      ctx.fillStyle = NEURAL_CONFIG.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      tickRef.current += NEURAL_CONFIG.pulseSpeed;
      const pulse = (Math.sin(tickRef.current) + 1) / 2;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Repulsion Effect (Mouse Interaction)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distMouseSq = dx * dx + dy * dy; // المربع أسرع من الـ Math.sqrt
        const radiusSq = NEURAL_CONFIG.mouseRadius * NEURAL_CONFIG.mouseRadius;

        if (distMouseSq < radiusSq) {
          const distance = Math.sqrt(distMouseSq);
          const force = (NEURAL_CONFIG.mouseRadius - distance) / NEURAL_CONFIG.mouseRadius;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }

        // Border Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw Nodes
        ctx.fillStyle = pulse > 0.85 ? "#ffffff" : NEURAL_CONFIG.colors.node;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + (pulse * 0.4), 0, Math.PI * 2);
        ctx.fill();

        // Optimized Connections Loop
        const step = isHighEnd ? 1 : 2; 
        for (let j = i + step; j < particles.length; j += step) {
          const p2 = particles[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const distSq = ldx * ldx + ldy * ldy;
          const connDistSq = NEURAL_CONFIG.connectionDistance * NEURAL_CONFIG.connectionDistance;
          
          if (distSq < connDistSq) {
            const distance = Math.sqrt(distSq);
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
      animationFrameId.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [canvasRef]); // Dependency وحيدة لضمان الثبات
}