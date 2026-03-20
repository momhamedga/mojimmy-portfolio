"use client"
import { useEffect } from "react";

export default function AnimatedFavicon() {
  useEffect(() => {
    const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    
    // لو معندكش لينك فافيكون في الهيد، الكود ده هيكريهه
    if (!favicon) {
      const link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    let step = 0;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, 32, 32);

      // 1. رسم حرف الـ M (الأساس الأبيض)
      ctx.fillStyle = "white";
      ctx.font = "900 24px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("M", 16, 16);

      // 2. تأثير النبض البنفسجي (The Glow)
      const opacity = (Math.sin(step) + 1) / 2; // قيمة بين 0 و 1
      ctx.shadowBlur = 8 * opacity;
      ctx.shadowColor = "#a855f7"; // اللون البنفسجي من اللوجو
      
      // رسم دائرة نيون صغيرة تحت الحرف بتنبض
      ctx.beginPath();
      ctx.arc(28, 28, 3 * opacity, 0, Math.PI * 2);
      ctx.fillStyle = "#a855f7";
      ctx.fill();

      // تحديث الأيقونة
      const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (faviconLink) {
        faviconLink.href = canvas.toDataURL();
      }

      step += 0.05;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return null; // المكون ده مش بيرندر حاجة في الصفحة، هو شغال في الـ Head بس
}