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
import { Suspense } from "react";
import Loading from "./loading"; // 1. استيراد مكون اللودينج اللي لسه عاملينه

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mojimmy.com"),
  title: {
    default: "Mojimmy | Creative Developer & UI Designer",
    template: "%s | Mojimmy"
  },
  description: "المصمم والمطور الإبداعي لبناء تجارب رقمية سينمائية باستخدام Next.js و Framer Motion.",
  keywords: ["مطور ويب", "تصميم واجهات", "Next.js 15", "Framer Motion Expert", "Creative Portfolio 2026", "برمجة المواقع"],
  authors: [{ name: "Mojimmy" }],
  creator: "Mojimmy",
  openGraph: {
    title: "Mojimmy | Portfolio",
    description: "استكشف مستقبل الويب من خلال تجارب رقمية تفاعلية.",
    url: "https://mojimmy.com",
    siteName: "Mojimmy Studio",
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mojimmy | Creative Developer",
    description: "بناء مستقبل الويب بتصاميم سينمائية.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#020202",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          
          {/* شلنا الـ Suspense اليدوي من هنا عشان Next.js يشغل loading.tsx لوحده */}
          <ScrollProgress />
          <CustomCursor />
          <AnimatedFavicon />
          
          <Toaster position="bottom-left" theme="dark" richColors />
          
          <SmoothScroll>
            <main className="relative min-h-screen flex flex-col">
              {children}
            </main>
            <FloatingLaunch />
            <WhatsAppButton />
            <MobileScrollTop /> 
          </SmoothScroll>

        </ThemeProvider>
      </body>
    </html>
  );
}