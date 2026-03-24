"use client"; // نحتاجه لوجود الـ Preloader والحالات التفاعلية

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

// تحسين الـ Fonts لتقليل الـ FOIT
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
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="scroll-smooth">
      <body className={`${cairo.variable} ${almarai.variable} ${inter.variable} antialiased bg-[#020202] text-foreground selection:bg-purple-500/30`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
    

          {/* 2. الخلفية الديناميكية ثابتة خلف الـ Scroll */}
          <div className="fixed inset-0 z-0">
            <BackgroundCanvas />
          </div>

          {/* 3. عناصر الـ UI الثابتة (Fixed Layers) */}
          <ScrollProgress />
          <CustomCursor />
          <AnimatedFavicon />
          <Toaster position="bottom-left" theme="dark" richColors closeButton />
          
          {/* 4. محرك الحركة السلسة */}
          <SmoothScroll>
            <main className="relative min-h-screen flex flex-col z-10 pointer-events-auto">
              {children}
            </main>
            
            {/* 5. الأدوات التفاعلية Floating UI */}
            <FloatingLaunch />
            <WhatsAppButton />
            <MobileScrollTop /> 
          </SmoothScroll>

        </ThemeProvider>
      </body>
    </html>
  );
}