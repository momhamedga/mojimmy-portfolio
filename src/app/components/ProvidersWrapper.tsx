"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import ScrollProgress from "./ScrollProgress";
import SmoothScroll from "./SmoothScroll";
import { MobileDock } from "./Layouts/Native";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), { ssr: false });

/**
 * القشرة العميلة الوحيدة في التطبيق.
 *
 * مهم: `children` بتوصل هنا كـ React nodes **مرسومة على السيرفر** بالفعل.
 * تمريرها جوّه Client Component لا يحوّلها لعميل — فشجرة الصفحة كلها
 * (Hero, Projects, Services, About, Process, FAQ, Contact, Footer) تفضل Server Components.
 *
 * تحسين أداء الموبايل: المكونات الحصرية لسطح المكتب (`CustomCursor`, `WhatsAppButton`)
 * و`Lenis` محمّلة كسولًا فقط عند `(min-width: 768px)` فلا تُحمّل `framer-motion`
 * أو `lenis` على الهواتف إطلاقًا.
 */
export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {/* أول عنصر قابل للتركيز في الصفحة — يظهر عند الوصول له بالكيبورد فقط */}
      <a
        href="#main-content"
        className="skip-link glass-light rounded-full px-5 py-3 font-cairo font-bold text-sm text-foreground shadow-lg"
      >
        تخطي إلى المحتوى
      </a>

      <ScrollProgress />
      {isDesktop && <CustomCursor />}

      <SmoothScroll>
        <main
          id="main-content"
          tabIndex={-1}
          className="relative min-h-screen flex flex-col z-10 pointer-events-auto pb-24 md:pb-0"
        >
          {children}
        </main>

        {/* زر الواتساب — ديسكتوب فقط */}
        {isDesktop && <WhatsAppButton />}
      </SmoothScroll>

      {/* الـ Dock للموبايل بره الـ Scroll بس جوه الـ Provider */}
      <MobileDock />
    </ThemeProvider>
  );
}
