import "@/app/globals.css";
import { Cairo } from "next/font/google";
import { Metadata } from "next";
import { ProvidersWrapper } from "./components/ProvidersWrapper";

export const metadata: Metadata = {
  title: "Mohamed Jimmy | Studio 2026",
  description: "Ultra-Modern Fullstack Developer Portfolio",
};

/**
 * Cairo هو الخط الوحيد المستخدم فعليًا (88 استخدامًا لـ font-cairo).
 * Almarai و Inter كانا محمّلين ومُسبَّقي التحميل (preload) بدون ولا استخدام واحد
 * كـ utility class — اتشالوا في Phase 3.
 *
 * النسخة المتغيّرة (variable) بتغطي كل الأوزان من ملف واحد بدل 4 ملفات ثابتة،
 * وبتصلّح أن font-light (300) و font-medium (500) كانا مستخدمين في الكود
 * بدون ما يكونوا محمّلين أصلًا فكان المتصفح يقرّبهم لأقرب وزن موجود.
 */
const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} antialiased bg-background text-foreground selection:bg-primary/20 overflow-x-hidden min-h-screen`}
      >
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
