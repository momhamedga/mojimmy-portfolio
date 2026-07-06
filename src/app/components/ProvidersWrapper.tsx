"use client";

import { useRef } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import AnimatedFavicon from "./AnimatedFavicon";
import CustomCursor from "./CustomCursor";
import ScrollProgress from "./ScrollProgress";
import SmoothScroll from "./SmoothScroll";
import FloatingLaunch from "./Layouts/FloatingLaunch";
import WhatsAppButton from "./WhatsAppButton";
import { MobileDock } from "./Layouts/Native";

// الـ Toaster بيتبع لون الوضع الفعلي (فاتح/داكن) بدل ما يفضل داكن ثابت
function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-left"
      theme={resolvedTheme === "light" ? "light" : "dark"}
      richColors
      closeButton
    />
  );
}

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AnimatedFavicon />
      <CustomCursor />
      <ScrollProgress />

      {/* الـ Smooth Scroll بيغلف المحتوى بالكامل بشكل سليم */}
      <SmoothScroll>
        <main
          ref={mainRef}
          className="relative min-h-screen flex flex-col z-10 pointer-events-auto pb-24 md:pb-0"
        >
          {children}
        </main>

        {/* أزرار الكمبيوتر */}
        <div className="fixed bottom-0 right-0 z-100 hidden md:flex flex-col gap-4 p-10 pointer-events-none">
          <div className="pointer-events-auto flex flex-col gap-4">
            <FloatingLaunch />
            <WhatsAppButton />
          </div>
        </div>
      </SmoothScroll>

      {/* الـ Dock للموبايل بره الـ Scroll بس جوه الـ Provider */}
      <MobileDock />

      <ThemedToaster />
    </ThemeProvider>
  );
}