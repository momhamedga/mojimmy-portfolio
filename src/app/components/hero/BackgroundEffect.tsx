"use client"
import { motion, useMotionTemplate, MotionValue } from "framer-motion";
import { memo } from "react";

// تعريف الـ Props بـ TypeScript صارم
interface BackgroundEffectProps {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}

export const BackgroundEffect = memo(({ springX, springY }: BackgroundEffectProps) => {
  
  // استخدام MotionTemplate للتحكم في الـ Radial Gradient بأداء 60fps
  // الـ Template بيحدث الـ CSS Variable مباشرة بدون Re-render للـ React
  const background = useMotionTemplate`
    radial-gradient(
      650px circle at ${springX}px ${springY}px, 
      rgba(168, 85, 247, 0.15), 
      transparent 80%
    )
  `;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      
      {/* 1. طبقة الـ Grid الثابتة (Low Opacity لتقليل جهد الرندر) */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `
            linear-gradient(#ffffff 1px, transparent 1px), 
            linear-gradient(90deg, #ffffff 1px, transparent 1px)
          `, 
          backgroundSize: '50px 50px' 
        }} 
      />

      {/* 2. تأثير الـ Spotlight (المغناطيسي) */}
      <motion.div 
        className="absolute inset-0" 
        style={{ 
          background,
          willChange: "background" // تنبيه المتصفح لتحسين أداء الـ Paint
        }} 
      />

      {/* 3. تأثير "الضباب" الجانبي (Vignette) لزيادة العمق */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,2,0.4)_100%)]" />
      
    </div>
  );
});

// تعيين الاسم لسهولة الـ Debugging في DevTools
BackgroundEffect.displayName = "BackgroundEffect";