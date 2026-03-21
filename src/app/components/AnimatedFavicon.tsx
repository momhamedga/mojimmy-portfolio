"use client"
import { useEffect, useRef } from "react";

export default function AnimatedFavicon() {
  const requestRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  useEffect(() => {
    // 1. إعداد الـ Canvas مرة واحدة فقط
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d", { alpha: true });
    
    // البحث عن أو إنشاء رابط الأيقونة
    let faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }

    const draw = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, 32, 32);

      // تنعيم الرسم (Anti-aliasing)
      ctx.imageSmoothingEnabled = true;

      // 2. رسم حرف الـ M (الأساس النيون)
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(168, 85, 247, 0.5)";
      ctx.fillStyle = "white";
      ctx.font = "900 22px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("M", 16, 16);

      // 3. تأثير النبض الذكي (The Pulse)
      const opacity = (Math.sin(stepRef.current) + 1) / 2;
      
      // رسم نقطة النيون الجانبية (مثل حالة الـ Online)
      ctx.shadowBlur = 10 * opacity;
      ctx.shadowColor = "#a855f7";
      ctx.beginPath();
      ctx.arc(26, 26, 4 * opacity, 0, Math.PI * 2);
      ctx.fillStyle = "#a855f7";
      ctx.fill();

      // تحديث الرابط (Data URL)
      faviconLink.href = canvas.toDataURL('image/png', 0.5); // جودة متوسطة لتوفير الذاكرة
    };

    let lastTime = 0;
    const animate = (time: number) => {
      // تحديد السرعة (Throttle) لـ 15 فريم في الثانية فقط
      if (time - lastTime >= 70) { 
        lastTime = time;
        stepRef.current += 0.1;
        draw();
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    // 4. ذكاء التوقف (Visibility Check)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      } else {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    requestRef.current = requestAnimationFrame(animate);

    // تنظيف (Cleanup) عند الخروج
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}