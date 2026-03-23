"use client"
import dynamic from 'next/dynamic';

// استيراد المكون بشكل ديناميكي وقفل الـ SSR تماماً
const BackgroundCanvas = dynamic(
  () => import('./DynamicBackground').then((mod) => mod.BackgroundCanvas),
  { 
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#05050a] -z-10" /> // خلفية سادة لحد ما الـ Canvas يحمل
  }
);

export default function BackgroundWrapper() {
  return <BackgroundCanvas />;
}