import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
};

/**
 * صفحة 404 — Server Component بالكامل، صفر JavaScript على العميل.
 */
export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <p className="text-6xl md:text-7xl font-black font-mono text-primary tabular-nums">404</p>

      <h1 className="text-3xl md:text-4xl font-black font-cairo text-foreground tracking-tight">
        الصفحة دي مش موجودة
      </h1>

      <p className="max-w-md text-foreground-dim font-cairo leading-relaxed">
        يمكن الرابط اتغيّر أو اتكتب غلط. ارجع للرئيسية وهتلاقي كل الأقسام مكانها.
      </p>

      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-primary-strong text-white font-cairo font-black text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        العودة للرئيسية
      </Link>
    </main>
  );
}
