"use client"
import { useEffect, useRef } from "react";

export default function AnimatedFavicon() {
  const requestRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  useEffect(() => {
    // 1. إعداد الـ Canvas والألوان الأساسية
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d", { alpha: true });
    
    let faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }

    const draw = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, 32, 32);

      // تأثير النبض (Pulse Logic)
      const pulse = (Math.sin(stepRef.current) + 1) / 2;
      const glowSize = 4 + (pulse * 6);

      // 2. رسم خلفية دائرية ناعمة جداً (اختياري لتعزيز الرؤية)
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8, 8, 8, 0.8)"; // لون خلفية الموقع
      ctx.fill();

      // 3. رسم حرف الـ M بتدرج نيون (Linear Gradient)
      const gradient = ctx.createLinearGradient(0, 0, 32, 32);
      gradient.addColorStop(0, "#a855f7"); // Purple-500
      gradient.addColorStop(1, "#3b82f6"); // Blue-500

      ctx.shadowBlur = glowSize;
      ctx.shadowColor = "rgba(168, 85, 247, 0.8)";
      
      ctx.fillStyle = pulse > 0.5 ? "#ffffff" : gradient; 
      ctx.font = "900 20px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("M", 16, 16);

      // 4. نقطة الحالة (Status Indicator) - بتتحرك ببطء
      ctx.shadowBlur = 12 * pulse;
      ctx.shadowColor = "#a855f7";
      ctx.beginPath();
      ctx.arc(26, 26, 3 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#a855f7";
      ctx.fill();

      // تحديث الرابط بـ Low Quality PNG لتقليل حجم الـ Data URL
      faviconLink.href = canvas.toDataURL('image/png', 0.3);
    };

    let lastTime = 0;
    const animate = (time: number) => {
      // 12 فريم في الثانية كافية جداً للأيقونة ومريحة للبطارية
      if (time - lastTime >= 85) { 
        lastTime = time;
        stepRef.current += 0.15;
        draw();
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      } else {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}