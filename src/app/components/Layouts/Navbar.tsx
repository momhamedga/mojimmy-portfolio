"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpLeft } from "lucide-react";
import { Logo } from "@/src/app/components/Layouts/Logo";
import { navLinks } from "@/src/constants/navLinks";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { ThemeToggle } from "../ThemeToggle";

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
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useLenis(({ scroll }) => {
    const currentScroll = scroll ?? window.scrollY;
    setIsFloating(currentScroll > 40);
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
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsOpen(false);
      const targetId = href.startsWith("#") ? href : `#${href}`;

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(targetId, {
            offset: -80,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    },
    [lenis],
  );

  return (
    <header dir="rtl" className="fixed top-0 left-0 right-0 z-100 flex justify-center px-4 pt-4">
      <div ref={panelRef} className="relative w-full max-w-4xl">
        {/* الشريط الرئيسي */}
        <motion.div
          animate={{ paddingInline: isFloating ? "0.5rem" : "0.75rem" }}
          className="glass-light flex items-center justify-between gap-2 rounded-full py-2 shadow-lg shadow-black/5 transition-shadow duration-500"
        >
          <div className="scale-[0.7] md:scale-75 origin-right shrink-0">
            <Logo />
          </div>

          {/* الروابط — ظاهرة مباشرة على الشاشات الكبيرة، بلا قائمة مخفية */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => handleScroll(e, link.href)}
                className="px-3.5 py-2 rounded-full text-[13px] font-cairo font-bold text-foreground-dim hover:text-foreground hover:bg-foreground/5 transition-colors"
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
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-cairo font-black hover:opacity-90 active:scale-95 transition-all"
            >
              لنبدأ
              <ArrowUpLeft size={13} />
            </Link>

            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isOpen}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border text-foreground-dim hover:text-foreground transition-colors"
            >
              {isOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </motion.div>

        {/* اللوحة المنسدلة (موبايل/تابلت فقط) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden glass-light absolute top-[calc(100%+0.5rem)] left-0 right-0 rounded-4xl p-3 shadow-2xl shadow-black/10 overflow-hidden"
            >
              <nav className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={`#${link.href}`}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="px-4 py-3 rounded-2xl text-[15px] font-cairo font-bold text-foreground-dim hover:text-foreground hover:bg-foreground/5 transition-colors text-right"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-2 pt-3 border-t border-border flex items-center justify-between px-4 pb-1">
                <div className="flex gap-4">
                  {SOCIAL_LINKS.map((soc) => (
                    <a
                      key={soc.name}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground-dim/70 hover:text-primary transition-colors"
                    >
                      {soc.name}
                    </a>
                  ))}
                </div>
                <Link
                  href="#contact"
                  onClick={(e) => handleScroll(e, "contact")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-[11px] font-cairo font-black"
                >
                  لنبدأ <ArrowUpLeft size={12} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
