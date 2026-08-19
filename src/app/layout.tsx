import "@/app/globals.css";
import { Cairo } from "next/font/google";
import { Metadata } from "next";
import { ProvidersWrapper } from "./components/ProvidersWrapper";
import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_TITLE, SITE_URL } from "@/constants/site";

/**
 * ما قبل Phase 7 كان العنوان "Mohamed Jimmy | Studio 2026" والوصف
 * "Ultra-Modern Fullstack Developer Portfolio" — اسم غير مستخدم في الواجهة،
 * وكلمة Studio توحي بشركة بينما الموقع لفرد واحد، ووصف إنجليزي لموقع عربي.
 *
 * كل عناوين SEO تُشتق من metadataBase فلا يتكرّر النطاق مكتوبًا يدويًا.
 * النطاق المعتمد هو نسخة www لأن الجذر يحوّل إليها 301 على مستوى الاستضافة.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    // Next يطبّع الجذر ويحذف الشرطة المائلة مهما مُرِّر، فنكتبها بالشكل
    // النسبي البسيط ونطابق sitemap على نفس التمثيل.
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: SITE_LOCALE,
  },
  twitter: {
    // لا حساب موثّق، فلا site/creator — لا نخترع اسم مستخدم
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  formatDetection: {
    telephone: false,
  },
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
