"use client";

import { ThemeProvider } from "next-themes";
import CustomCursor from "./CustomCursor";
import ScrollProgress from "./ScrollProgress";
import SmoothScroll from "./SmoothScroll";
import WhatsAppButton from "./WhatsAppButton";
import { MobileDock } from "./Layouts/Native";

/**
 * القشرة العميلة الوحيدة في التطبيق.
 *
 * مهم: `children` بتوصل هنا كـ React nodes **مرسومة على السيرفر** بالفعل.
 * تمريرها جوّه Client Component لا يحوّلها لعميل — فشجرة الصفحة كلها
 * (Hero, Projects, Services, About, Process, FAQ, Contact, Footer) تفضل Server Components.
 *
 * ThemeProvider لازم يفضل مغلّفًا لأن ThemeToggle (جوّه Navbar) بيستهلك الـ context.
 * باقي العناصر جزر مستقلة، كل واحدة تحمّل الـ JS بتاعها فقط.
 */
export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {/* أول عنصر قابل للتركيز في الصفحة — يظهر عند الوصول له بالكيبورد فقط */}
      <a
        href="#main-content"
        className="skip-link glass-light rounded-full px-5 py-3 font-cairo font-bold text-sm text-foreground shadow-lg"
      >
        تخطي إلى المحتوى
      </a>

      <ScrollProgress />
      <CustomCursor />

      <SmoothScroll>
        <main
          id="main-content"
          tabIndex={-1}
          className="relative min-h-screen flex flex-col z-10 pointer-events-auto pb-24 md:pb-0"
        >
          {children}
        </main>

        {/* زر الواتساب — ديسكتوب فقط، الزر نفسه fixed ومسؤول عن مكانه */}
        <WhatsAppButton />
      </SmoothScroll>

      {/* الـ Dock للموبايل بره الـ Scroll بس جوه الـ Provider */}
      <MobileDock />
    </ThemeProvider>
  );
}
