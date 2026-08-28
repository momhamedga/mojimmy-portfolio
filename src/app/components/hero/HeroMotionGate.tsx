"use client";

import { useEffect } from "react";

/**
 * بوابة حركة الـ Hero — جزيرة عميل بلا أي مخرجات مرئية.
 *
 * تعليق سابق في Hero زعم أن المتصفح يوقف أنيميشن CSS للعناصر خارج الشاشة
 * تلقائيًا، فأُزيل المراقب القديم باعتباره "تكلفة بلا مقابل". القياس في
 * Phase 2B أثبت العكس: مع الـHero على بُعد ‎8702px‎ فوق الشاشة تبقى
 * `aurora-a/b/c` و`gradient-pan` في حالة `running`، وعدد إعادة حساب
 * الأنماط لا يتغيّر إطلاقًا (‎723‎ مقابل ‎722‎ وهي ظاهرة).
 *
 * لذلك المراقب يعود — واحد فقط، على قسم الـHero نفسه لا على كل عنصر زخرفي.
 * لا مستمع تمرير، ولا rAF، ولا قياس موضع متكرر: المتصفح يحسب التقاطع خارج
 * الخيط الرئيسي ويُطلق الحدث مرتين فقط في العمر الطبيعي للصفحة.
 *
 * الإيقاف بـ`animation-play-state: paused` لا بحذف الحركة: الحركة تستأنف من
 * الطور نفسه عند العودة، فلا قفزة ولا إعادة تشغيل من الصفر.
 */
export function HeroMotionGate() {
  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        hero.dataset.motion = entry.isIntersecting ? "running" : "paused";
      },
      // هامش سخي: لا نوقف الحركة إلا بعد ابتعاد حقيقي، فلا تذبذب عند الحافة.
      { rootMargin: "200px 0px 200px 0px", threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return null;
}
