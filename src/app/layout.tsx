import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

// 1. تحسين تحميل الخطوط (Geist)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // لضمان ظهور النص فوراً
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// 2. SEO & Metadata الفولاذي
export const metadata: Metadata = {
  metadataBase: new URL("https://mojimmy.com"), // ضروري للروابط النسبية
  title: {
    default: "Mojimmy | Creative Developer & UI Designer",
    template: "%s | Mojimmy"
  },
  description: "المصمم والمطور الإبداعي لبناء تجارب رقمية سينمائية باستخدام Next.js و Framer Motion.",
  keywords: ["مطور ويب", "تصميم واجهات", "Next.js 15", "Framer Motion Expert", "Creative Portfolio 2026", "برمجة المواقع"],
  authors: [{ name: "Mojimmy" }],
  creator: "Mojimmy",
  alternates: {
    canonical: "/",
    languages: {
      'ar-EG': '/ar',
    },
  },
  openGraph: {
    title: "Mojimmy | Portfolio",
    description: "استكشف مستقبل الويب من خلال تجارب رقمية تفاعلية.",
    url: "https://mojimmy.com",
    siteName: "Mojimmy Studio",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/og-image.png", // تأكد من وجود صورة في public folder
        width: 1200,
        height: 630,
        alt: "Mojimmy Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mojimmy | Creative Developer",
    description: "بناء مستقبل الويب بتصاميم سينمائية.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#020202",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // للسماح بالـ Zoom لتحسين الـ Accessibility
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="scroll-smooth">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020202] text-white selection:bg-purple-500/30`} 
        suppressHydrationWarning={true}
      >
        {/* --- طبقة الـ Grain (Hardware Accelerated) --- */}
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{ 
            backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
            willChange: "transform" 
          }} 
        />

        {/* --- الأدوات التفاعلية (خارج الـ SmoothScroll لضمان الثبات) --- */}
        <ScrollProgress />
        <CustomCursor />
        <AnimatedFavicon />
        
        <Toaster 
          position="bottom-left" // الأفضل للـ RTL يكون في اليسار عشان ميتداخلش مع الأزرار
          theme="dark" 
          richColors 
          closeButton
        />
        
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false} 
          disableTransitionOnChange // يمنع الـ Flash أثناء تبديل الثيم
        >
          <SmoothScroll>
            <main className="relative min-h-screen flex flex-col">
              {children}
            </main>
            
            {/* أزرار التفاعل (UI Layers) */}
            <FloatingLaunch />
            <WhatsAppButton />
            <MobileScrollTop /> 
          </SmoothScroll>
        </ThemeProvider>

        {/* تأثير الـ Global Glow الخلفي */}
        <div className="fixed -z-10 bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-purple-900/5 to-transparent pointer-events-none" />
      </body>
    </html>
  );
}