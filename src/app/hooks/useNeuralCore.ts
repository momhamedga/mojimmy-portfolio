"use client";
import { useEffect } from "react";
import { NEURAL_CONFIG } from "@/src/lib/db";

export function useNeuralCore(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;
    
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const optimizedCount = cores > 8 
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

    const particles = Array.from({ length: optimizedCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * NEURAL_CONFIG.velocity,
      vy: (Math.random() - 0.5) * NEURAL_CONFIG.velocity,
    }));

    const draw = () => {
      ctx.fillStyle = NEURAL_CONFIG.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      tick += NEURAL_CONFIG.pulseSpeed;
      const pulse = (Math.sin(tick) + 1) / 2;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.hypot(dx, dy);

        if (distance < NEURAL_CONFIG.mouseRadius) {
          const force = (NEURAL_CONFIG.mouseRadius - distance) / NEURAL_CONFIG.mouseRadius;
          p.x -= dx * force * 0.03;
          p.y -= dy * force * 0.03;
        }

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = pulse > 0.8 ? "#fff" : NEURAL_CONFIG.colors.node;
        ctx.beginPath();
        ctx.arc(p.x, p.y, NEURAL_CONFIG.particleSize + (pulse * 0.5), 0, Math.PI * 2);
        ctx.fill();

        const step = cores < 6 ? 2 : 1; 
        for (let j = i + step; j < particles.length; j += step) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          
          if (dist < NEURAL_CONFIG.connectionDistance) {
            const finalOpacity = (1 - dist / NEURAL_CONFIG.connectionDistance) * (0.1 + pulse * 0.3); 
            ctx.strokeStyle = `rgba(${NEURAL_CONFIG.colors.line}, ${finalOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef]);
}