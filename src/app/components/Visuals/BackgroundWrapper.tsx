"use client"
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// استيراد المكون مع تحسين الـ Loading
const BackgroundCanvas = dynamic(
  () => import('./DynamicBackground').then((mod) => mod.BackgroundCanvas),
  { 
    ssr: false,
    // بدل السواد، نستخدم نفس لون الخلفية المتغير بتاعنا عشان ميبانش فرق
    loading: () => (
      <div className="fixed inset-0 bg-background -z-20 transition-opacity duration-500" />
    )
  }
);

export default function BackgroundWrapper() {
  // استخدام useMemo عشان نضمن إن الـ Wrapper ميعملش Re-render غير لو فعلاً محتاجين
  const memoizedCanvas = useMemo(() => <BackgroundCanvas />, []);

  return (
    <div className="contents">
      {memoizedCanvas}
      {/* طبقة Noise خفيفة جداً بتتحمل فوراً فوق الـ Loading لحد ما الـ Canvas يجهز */}
      <div className="fixed inset-0 opacity-[0.01] bg-noise pointer-events-none z-[-5]" />
    </div>
  );
}