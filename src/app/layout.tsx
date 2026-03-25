"use client";

import { Cairo, Almarai, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import { Toaster } from 'sonner';
import WhatsAppButton from "./components/WhatsAppButton";
import MobileScrollTop from "./components/MobileScrollTop";
import FloatingLaunch from "./components/Layouts/FloatingLaunch";
import AnimatedFavicon from "./components/AnimatedFavicon";
import { BackgroundCanvas } from "./components/Visuals/DynamicBackground";
import { useRef, useEffect } from "react";

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['200', '400', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-almarai',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Refs للتحكم المطلق في البنية التحتية للموقع
  const mainRef = useRef<HTMLElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);

  // 2. تكتيك 2026: ربط حركة الـ Canvas بحالة الـ Main لتقليل جهد الـ GPU
  useEffect(() => {
    if (mainRef.current && bgContainerRef.current) {
      // هنا ممكن تضيف Logic يقلل الـ Opacity بتاع الخلفية لما اليوزر يتفاعل مع الـ Main
      console.log("System Ready: Mojimmy Architecture Active");
    }
  }, []);

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="scroll-smooth">
      <body className={`${cairo.variable} ${almarai.variable} ${inter.variable} antialiased bg-[#020202] text-foreground selection:bg-purple-500/30 overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          
          {/* خلفية ديناميكية: استخدام Ref هنا يضمن ثبات الـ Canvas أثناء الـ Hydration */}
          <div ref={bgContainerRef} className="fixed inset-0 z-0 pointer-events-none">
            <BackgroundCanvas />
            {/* تأثير الـ Noise السينمائي الثابت */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
          </div>

          {/* Fixed Core Layers */}
          <ScrollProgress />
          <CustomCursor />
          <AnimatedFavicon />
          <Toaster position="bottom-left" theme="dark" richColors closeButton />
          
          {/* محرك الحركة السلسة */}
          <SmoothScroll>
            <main 
              ref={mainRef} 
              className="relative min-h-screen flex flex-col z-10 pointer-events-auto"
            >
              {children}
            </main>
            
            {/* UI العائم: وضعه داخل الـ SmoothScroll يضمن تزامن حركته مع الـ Lenis */}
            <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-4 p-6 md:p-10 pointer-events-none">
              <div className="pointer-events-auto flex flex-col gap-4">
                <FloatingLaunch />
                <WhatsAppButton />
              </div>
            </div>
            
            <div className="fixed bottom-6 left-6 z-[100] pointer-events-auto">
               <MobileScrollTop /> 
            </div>
          </SmoothScroll>

        </ThemeProvider>
      </body>
    </html>
  );
}