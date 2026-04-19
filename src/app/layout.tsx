"use client";

import { Cairo, Almarai, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import { Toaster } from 'sonner';
import WhatsAppButton from "./components/WhatsAppButton";
import MobileScrollTop from "./components/MobileScrollTop";
import FloatingLaunch from "./components/Layouts/FloatingLaunch";
import AnimatedFavicon from "./components/AnimatedFavicon";
import dynamic from 'next/dynamic';
import { useRef } from "react";
import { MobileDock } from "./components/Layouts/Native";
import { TimeAwareProvider } from "./components/Layouts/TimeAwareProvider";

// تحميل الخلفية ديناميكياً لرفع الأداء (SSR: False)
const BackgroundCanvas = dynamic(() => import("./components/Visuals/DynamicBackground").then(mod => mod.BackgroundCanvas), { 
  ssr: false 
});

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
}: {
  children: React.ReactNode;
}) {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="scroll-smooth">
      <body className={`${cairo.variable} ${almarai.variable} ${inter.variable} antialiased bg-[#020202] text-foreground selection:bg-primary/20 overflow-x-hidden`}>
              <TimeAwareProvider>
          {/* خلفية الكمبيوتر فقط - Performance Optimization */}
          <div className="fixed inset-0 z-0 pointer-events-none hidden md:block">
            <BackgroundCanvas />
            <div className="absolute inset-0 opacity-[0.015] bg-noise pointer-events-none" />
          </div>


          <CustomCursor />
          <AnimatedFavicon />
          <Toaster position="bottom-left" theme="dark" richColors closeButton />
          
          <SmoothScroll>
            <main 
              ref={mainRef} 
              className="relative min-h-screen flex flex-col z-10 pointer-events-auto pb-24 md:pb-0"
            >
              {children}
            </main>
            
            {/* أزرار التواصل للكمبيوتر - تختفي في الموبايل لوجود الـ Dock */}
            <div className="fixed bottom-0 right-0 z-[100] hidden md:flex flex-col gap-4 p-10 pointer-events-none">
              <div className="pointer-events-auto flex flex-col gap-4">
                <FloatingLaunch />
                <WhatsAppButton />
              </div>
            </div>
            
            <div className="fixed bottom-6 left-6 z-[100] md:block hidden pointer-events-auto">
               <MobileScrollTop /> 
            </div>
          </SmoothScroll>

          {/* تجربة التطبيق للموبايل حصراً */}
          <MobileDock />
      
</TimeAwareProvider>
    
      </body>
    </html>
  );
}