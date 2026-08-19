"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * حدود الخطأ لمسارات App Router.
 * لا تعرض أي stack trace للمستخدم — التفاصيل تُسجَّل في الكونسول فقط.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <h1 className="text-3xl md:text-4xl font-black font-cairo text-foreground tracking-tight">
        حصل خطأ غير متوقع
      </h1>

      <p className="max-w-md text-foreground-dim font-cairo leading-relaxed">
        عذرًا، لم نتمكن من عرض هذا الجزء من الصفحة. جرّب مرة أخرى، ولو استمرت المشكلة تواصل معي
        مباشرة.
      </p>

      {error.digest && (
        <p className="text-xs text-foreground-dim font-mono">
          رقم مرجعي للخطأ: <span className="select-all">{error.digest}</span>
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 rounded-full bg-primary-strong text-white font-cairo font-black text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          حاول مرة أخرى
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-full border border-border text-foreground font-cairo font-bold text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
