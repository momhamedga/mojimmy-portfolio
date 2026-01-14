import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import { Toaster } from 'sonner';
import WhatsAppButton from "./components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. ضبط الـ SEO الاحترافي (Metadata)
export const metadata: Metadata = {
  title: {
    default: "Mojimmy | Creative Developer & UI Designer",
    template: "%s | Mojimmy"
  },
  description: "المصمم والمطور الإبداعي لبناء تجارب رقمية سينمائية باستخدام Next.js و Framer Motion.",
  keywords: ["مطور ويب", "تصميم واجهات", "Next.js 15", "Framer Motion Expert", "Creative Portfolio 2026"],
  authors: [{ name: "Mojimmy" }],
  creator: "Mojimmy",
  openGraph: {
    title: "Mojimmy | Portfolio",
    description: "استكشف مستقبل الويب من خلال تجارب رقمية تفاعلية.",
    url: "https://mojimmy.com", // غيري هذا الدومين لاحقاً
    siteName: "Mojimmy Studio",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mojimmy | Creative Developer",
    description: "بناء مستقبل الويب بتصاميم سينمائية.",
  },
  robots: "index, follow",
};

// 2. ضبط الـ Viewport لضمان أفضل تجربة موبايل
export const viewport: Viewport = {
  themeColor: "#020202",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning // أضف هذه الخاصية هنا أيضاً
      >
        {/* --- طبقة الـ Grain/Noise السينمائية الثابتة --- */}
        {/* أضفت لكِ الكلاسات اللازمة في globals.css لاحقاً لتشغيل الـ Animation */}
        <div className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

        {/* --- الأدوات التفاعلية --- */}
        <ScrollProgress />
        <CustomCursor />
        <Toaster position="bottom-right" theme="dark" richColors expand={false} />
        
        {/* --- الـ Providers --- */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScroll>
            {/* الحاوية الرئيسية للمحتوى */}
            <main className="relative flex flex-col">
              {children}
            </main>
            
            {/* أزرار التفاعل الثابتة */}
            <WhatsAppButton />
          </SmoothScroll>
        </ThemeProvider>

        {/* تأثير الـ Glow الخفي في زوايا الموقع (اختياري للفخامة) */}
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] -z-10 pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] -z-10 pointer-events-none" />
      </body>
    </html>
  );
}