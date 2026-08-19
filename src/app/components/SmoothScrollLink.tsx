"use client";

import type { ReactNode } from "react";

/**
 * رابط داخلي بسكرول ناعم — جزيرة عميل صغيرة.
 *
 * Progressive enhancement حقيقي: العنصر `<a href="#id">` سليم في الـ HTML،
 * فلو الـ JS فشل الرابط لسه بيشتغل (قفزة أصلية). الـ JS بيحسّنه لسكرول ناعم بس.
 * كان قبل كده `<button onClick>` — يعني بلا JS ما كانش بيعمل أي حاجة.
 */
export default function SmoothScrollLink({
  targetId,
  className,
  ariaLabel,
  children,
}: {
  targetId: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${targetId}`}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        const el = document.getElementById(targetId);
        if (!el) return; // نسيب المتصفح يتصرّف بشكل طبيعي
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );
}
