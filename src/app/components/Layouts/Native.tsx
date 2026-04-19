"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LayoutGrid, Wrench, MessageSquare } from "lucide-react";
import { useEffect, useState, useCallback, memo } from "react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "projects", label: "أعمالي", icon: LayoutGrid },
  { id: "services", label: "خدماتي", icon: Wrench },
  { id: "contact", label: "تواصل", icon: MessageSquare },
];

export const MobileDock = memo(() => {
  const [activeSection, setActiveSection] = useState("home");

  const handleScroll = useCallback(() => {
    // استخدام requestAnimationFrame لتحسين أداء السكرول على الموبايل
    window.requestAnimationFrame(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // هزة خفيفة للموبايل عند الضغط
      if (window.navigator.vibrate) window.navigator.vibrate(10);
      
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[400px]">
      <nav className="relative flex items-center justify-around p-2 rounded-[2.2rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* تأثير إضاءة خلفي (Glow) يتبع العنصر النشط */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{
              x: activeSection === "home" ? "-150%" : activeSection === "projects" ? "-50%" : activeSection === "services" ? "50%" : "150%"
            }}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 blur-2xl rounded-full"
          />
        </div>

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-3 transition-all active:scale-90"
            >
              {/* الحاوية النشطة (The Pill) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-x-1.5 inset-y-1 bg-gradient-to-b from-white/[0.08] to-transparent rounded-[1.2rem] border border-white/[0.05] z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              {/* الأيقونة */}
              <div className={cn(
                "relative z-10 transition-all duration-500",
                isActive ? "text-primary -translate-y-1" : "text-white/30"
              )}>
                <Icon 
                   size={22} 
                   strokeWidth={isActive ? 2.5 : 2} 
                   className={isActive ? "drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" : ""}
                />
              </div>

              {/* العنوان */}
              <motion.span 
                animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.9 }}
                className={cn(
                  "relative z-10 text-[10px] font-cairo font-black mt-1 uppercase tracking-tighter transition-colors",
                  isActive ? "text-white" : "text-white/40"
                )}
              >
                {item.label}
              </motion.span>

              {/* نقطة صغيرة تحت العنصر النشط */}
              {isActive && (
                <motion.div 
                  layoutId="dot"
                  className="absolute bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#a855f7]"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
});

MobileDock.displayName = "MobileDock";