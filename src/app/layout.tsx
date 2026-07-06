import "@/src/app/globals.css";
import { Cairo, Almarai, Inter } from "next/font/google";
import { Metadata } from "next";
import { ProvidersWrapper } from "./components/ProvidersWrapper";

export const metadata: Metadata = {
  title: "Mohamed Jimmy | Studio 2026",
  description: "Ultra-Modern Fullstack Developer Portfolio",
};

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
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${almarai.variable} ${inter.variable} antialiased bg-background text-foreground selection:bg-primary/20 overflow-x-hidden min-h-screen`}>
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
      </body>
    </html>
  );
}