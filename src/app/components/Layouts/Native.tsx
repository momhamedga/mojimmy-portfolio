"use client";
import { Home, LayoutGrid, Wrench, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/app/hooks/use-active-section";

const navItems = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "projects", label: "أعمالي", icon: LayoutGrid },
  { id: "services", label: "خدماتي", icon: Wrench },
  { id: "contact", label: "تواصل", icon: MessageSquare },
];

/**
 * شريط التنقّل السفلي للموبايل — CSS خالص بدون `framer-motion`.
 * يستهلك نفس مصدر الحقيقة (`useActiveSection`) مع شريط سطح المكتب.
 */
const SECTION_TO_DOCK: Record<string, string> = {
  home: "home",
  projects: "projects",
  about: "projects",
  services: "services",
  process: "services",
  faq: "services",
  contact: "contact",
};

const GLOW_OFFSET: Record<string, string> = {
  home: "-150%",
  projects: "-50%",
  services: "50%",
  contact: "150%",
};

export const MobileDock = () => {
  const section = useActiveSection();
  const activeSection = SECTION_TO_DOCK[section] ?? "home";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    if ("vibrate" in navigator && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigator.vibrate(10);
    }
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-100 w-[92%] max-w-100">
      <nav
        aria-label="تنقّل سريع"
        className="relative flex items-center justify-around p-2 rounded-[2.2rem] bg-surface/70 backdrop-blur-2xl border border-border shadow-xl shadow-black/10 overflow-hidden"
      >
        {/* تأثير إضاءة خلفي (Glow) يتبع العنصر النشط */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div
            style={{ transform: `translateX(${GLOW_OFFSET[activeSection] ?? "-150%"})` }}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 blur-2xl rounded-full motion-safe:transition-transform motion-safe:duration-300"
          />
        </div>

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-current={isActive ? "true" : undefined}
              className="relative flex flex-col items-center justify-center flex-1 py-3 min-h-14 transition-all active:scale-90"
            >
              {/* الحاوية النشطة (The Pill) */}
              {isActive && (
                <div className="absolute inset-x-1.5 inset-y-1 bg-linear-to-b from-foreground/8 to-transparent rounded-[1.2rem] border border-border z-0" />
              )}

              {/* الأيقونة */}
              <div
                className={cn(
                  "relative z-10 transition-all duration-500",
                  isActive ? "text-primary -translate-y-1" : "text-foreground-dim",
                )}
              >
                <Icon
                  aria-hidden="true"
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={
                    isActive
                      ? {
                          filter:
                            "drop-shadow(0 0 8px color-mix(in oklch, var(--color-primary) 50%, transparent))",
                        }
                      : undefined
                  }
                />
              </div>

              {/* العنوان */}
              <span
                className={cn(
                  "relative z-10 text-[10px] font-cairo font-black mt-1 uppercase tracking-tighter transition-all duration-300",
                  isActive ? "text-foreground scale-100" : "text-foreground-subtle scale-90",
                )}
              >
                {item.label}
              </span>

              {/* نقطة صغيرة تحت العنصر النشط */}
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
