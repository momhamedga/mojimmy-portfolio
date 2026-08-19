"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Menu, X, ArrowUpLeft } from "lucide-react";
import { Logo } from "./Logo";
import { navLinks } from "@/constants/navLinks";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { ThemeToggle } from "../ThemeToggle";
import { cn } from "@/lib/utils";

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://www.facebook.com/midoga20/" },
  { name: "Github", href: "https://github.com/momhamedga" },
  { name: "Instagram", href: "https://www.instagram.com/jimmy_mo98/" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const floatingRef = useRef(false);

  // كان بينادي setIsFloating مع **كل frame سكرول**. دلوقتي حارس بـ ref:
  // الاستدعاء بيحصل بس لما القيمة المنطقية تتغيّر فعلًا (مرتين في العمر الطبيعي للصفحة).
  useLenis(({ scroll }) => {
    const next = (scroll ?? window.scrollY) > 40;
    if (next === floatingRef.current) return;
    floatingRef.current = next;
    setIsFloating(next);
  });

  // إغلاق القائمة عند الضغط برّه أو بزر Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      // إرجاع التركيز للزر اللي فتح القائمة، وإلا ضاع التركيز في بداية المستند
      toggleRef.current?.focus();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // اتشال الـ setTimeout(100ms) المصطنع: كان بيأخّر كل تنقّل بلا سبب وظيفي.
  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const targetId = href.startsWith("#") ? href : `#${href}`;
      const target = document.querySelector(targetId);
      if (!target) return; // بلا هدف: نسيب الرابط يشتغل بشكل طبيعي

      e.preventDefault();
      setIsOpen(false);

      if (lenis) {
        lenis.scrollTo(targetId, {
          offset: -80,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis],
  );

  return (
    <header dir="rtl" className="fixed top-0 left-0 right-0 z-100 flex justify-center px-4 pt-4">
      <div ref={panelRef} className="relative w-full max-w-4xl">
        {/* الشريط الرئيسي */}
        <div
          className={cn(
            "glass-light flex items-center justify-between gap-2 rounded-full py-2 shadow-lg shadow-black/5",
            "transition-[padding,box-shadow] duration-500",
            isFloating ? "px-2" : "px-3",
          )}
        >
          <div className="scale-[0.7] md:scale-75 origin-right shrink-0">
            <Logo />
          </div>

          {/*
            الروابط داخل حاوية واحدة: الشريط بقى ثلاث مناطق مقروءة —
            الهوية | التنقّل | الإجراءات — بدل ستة روابط سائبة بنفس وزن الشعار والزر.
            الحشو ضُيّق (px-3 و gap-0.5) لتعويض عرض الحاوية عند 1024px.
          */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden lg:flex items-center gap-0.5 rounded-full border border-border/60 bg-foreground/3 p-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => handleScroll(e, link.href)}
                className="px-3 py-1.5 rounded-full text-[13px] font-cairo font-bold text-foreground-dim transition-colors hover:text-foreground hover:bg-foreground/8"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            <Link
              href="#contact"
              onClick={(e) => handleScroll(e, "contact")}
              className="group hidden sm:flex items-center gap-1.5 px-3.5 py-2 min-h-11 rounded-full bg-primary-strong text-white text-xs font-cairo font-black whitespace-nowrap transition-opacity hover:opacity-90 active:scale-95"
            >
              ابدأ مشروعك
              <ArrowUpLeft
                aria-hidden="true"
                size={13}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </Link>

            <button
              type="button"
              ref={toggleRef}
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full bg-surface border border-border-strong/50 text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/*
          اللوحة المنسدلة (موبايل/تابلت فقط).

          5B.10: كانت داخل AnimatePresence بشرط {isOpen && ...}، فالعنصر
          id="mobile-menu" غير موجود أصلًا وقت الإغلاق — بينما الزر يشير إليه
          بـaria-controls دائمًا. مرجع ARIA مكسور في الحالة الافتراضية.

          الآن تُرسَم دائمًا، والإغلاق بـinert: يخرجها من ترتيب التركيز ومن
          شجرة الإتاحة ويمنع أي تفاعل، بلا حذفها من الـDOM. الحركة انتقال CSS
          يغطيه نظام prefers-reduced-motion القائم.
        */}
        <div
          id="mobile-menu"
          inert={!isOpen}
          className={cn(
            "lg:hidden glass-light absolute top-[calc(100%+0.5rem)] left-0 right-0 rounded-4xl p-3 shadow-2xl shadow-black/10 overflow-hidden origin-top",
            "transition-[opacity,transform] duration-250",
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none",
          )}
        >
          <nav aria-label="قائمة التنقل للجوال" className="flex flex-col divide-y divide-border/60">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => handleScroll(e, link.href)}
                className="px-4 py-3.5 min-h-12 flex items-center justify-end rounded-xl text-[15px] font-cairo font-bold text-foreground-dim transition-colors hover:text-foreground hover:bg-foreground/5 text-right"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* الدعوة أولًا وبعرض كامل، والروابط الخارجية نص هادئ تحتها */}
          <div className="mt-3 pt-3 border-t border-border flex flex-col gap-3">
            <Link
              href="#contact"
              onClick={(e) => handleScroll(e, "contact")}
              className="group w-full min-h-12 flex items-center justify-center gap-2 rounded-full bg-primary-strong text-white text-sm font-cairo font-black"
            >
              ابدأ مشروعك
              <ArrowUpLeft
                aria-hidden="true"
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </Link>

            <div className="flex items-center justify-center gap-1">
              {SOCIAL_LINKS.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${soc.name} (يفتح في تبويب جديد)`}
                  className="px-3 py-2 min-h-11 inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-foreground-dim transition-colors hover:text-primary"
                >
                  {soc.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
