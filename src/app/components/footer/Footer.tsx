"use client"
import { motion } from "framer-motion";
import { Github, Facebook, Instagram, ArrowUpLeft, Globe, Clock } from "lucide-react";
import Link from "next/link";
import Magnetic from "../Magnetic";
import { Logo } from "../Layouts/Logo";
import { navLinks } from "@/src/constants/navLinks";
import { useCallback, useMemo, useEffect, useRef, memo, type ReactNode } from "react";

interface SocialLinkData {
  icon: ReactNode;
  href: string;
  label: string;
}

// مكون الروابط الاجتماعية — چيبس زجاجية أصغر بنفس لغة TechIcon/ProjectCard
const SocialLink = memo(({ link }: { link: SocialLinkData }) => {
  const isExternalHttp = typeof link.href === "string" && link.href.startsWith("http");

  const handleTouch = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(8);
    }
  };

  return (
    <Magnetic intensity={0.3}>
      <motion.a
        href={link.href}
        target={isExternalHttp ? "_blank" : undefined}
        rel={isExternalHttp ? "noopener noreferrer" : undefined}
        onTouchStart={handleTouch}
        whileTap={{ scale: 0.92 }}
        aria-label={link.label}
        className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl transition-all duration-300 md:hover:-translate-y-1 md:hover:border-primary/40"
      >
        <span className="text-foreground-dim md:group-hover:text-primary transition-colors duration-300">
          {link.icon}
        </span>
      </motion.a>
    </Magnetic>
  );
});

SocialLink.displayName = "SocialLink";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const uaeTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(new Date());

      if (timeRef.current) {
        timeRef.current.textContent = uaeTime;
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const socialLinks = useMemo(() => [
    { icon: <Github size={17} />, href: "https://github.com/momhamedga", label: "جيت هاب" },
    { icon: <Facebook size={17} />, href: "https://www.facebook.com/midoga20/", label: "فيسبوك" },
    { icon: <Instagram size={17} />, href: "https://www.instagram.com/jimmy_mo98/", label: "إنستجرام" },
  ], []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(15);
    }
  }, []);

  return (
    <footer className="relative pt-20 md:pt-24 pb-10 overflow-hidden" id="footer" dir="rtl">

      {/* توهّج خلفي هادئ */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -bottom-40 right-0 w-125 h-125 bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-125 h-125 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* بطاقة الدعوة الختامية — زجاج + بورد + نقش زخرفي + توهّج ركني، بنفس لغة كروت الخدمات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-3xl border border-border bg-glass backdrop-blur-2xl overflow-hidden px-6 py-10 md:px-14 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 text-center md:text-right mb-16 md:mb-20"
        >
          {/* نقش النقاط الزخرفي */}
          <div
            className="absolute -top-8 -right-8 w-40 h-40 opacity-[0.1] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* توهّج ركني */}
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-accent/20 blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-cairo text-foreground tracking-tight mb-2">
              عندك فكرة مشروع؟
            </h2>
            <p className="text-foreground-dim text-sm md:text-base font-cairo">
              لنحوّلها لواقع رقمي مذهل — نبدأ النهاردة.
            </p>
          </div>
          <Magnetic>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative z-10 shrink-0 flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-cairo font-black text-base hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              لنتعاون؟
              <ArrowUpLeft size={20} />
            </button>
          </Magnetic>
        </motion.div>

        {/* الشبكة الرئيسية — هوية الماركة | روابط سريعة | تواصل */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pb-14 border-t border-border pt-14">

          {/* هوية الماركة */}
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-right">
            <div className="scale-90 origin-center md:origin-right">
              <Logo />
            </div>
            <p className="text-foreground-dim text-sm font-cairo leading-relaxed max-w-56">
              مطوّر واجهات وتجارب ويب تجمع بين الأداء والتصميم.
            </p>
            <div className="flex items-center gap-2.5 text-foreground-dim font-cairo text-xs">
              <Globe size={14} className="text-primary" />
              <span>أبوظبي، الإمارات</span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground font-bold font-cairo text-sm tracking-tight">
              <Clock size={14} className="text-accent" />
              <span ref={timeRef} suppressHydrationWarning className="tabular-nums">--:--:-- --</span>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-dim/60 font-cairo mb-1">
              روابط سريعة
            </span>
            <nav className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2.5 text-center md:text-right">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`#${link.href}`}
                  className="text-sm font-cairo font-bold text-foreground-dim md:hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* تواصل + حالة التوفّر */}
          <div className="flex flex-col items-center md:items-end gap-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-dim/60 font-cairo">
              تواصل معايا
            </span>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <SocialLink key={link.label} link={link} />
              ))}
            </div>
            <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">متاح للمشاريع الكبرى</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Scroll to Top */}
        <div className="pt-8 border-t border-border flex flex-col items-center gap-8">
          <Magnetic>
            <button
              onClick={scrollToTop}
              aria-label="الرجوع لأعلى الصفحة"
              className="flex flex-col items-center gap-3 text-foreground-dim md:hover:text-foreground transition-all group"
            >
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center md:group-hover:bg-foreground md:group-hover:text-background transition-all">
                 <ArrowUpLeft className="rotate-45 md:group-hover:-translate-y-0.5 transition-transform" size={18} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] font-cairo">العودة للقمة</span>
            </button>
          </Magnetic>

          <p className="text-foreground-dim text-[11px] font-cairo uppercase tracking-[0.2em] opacity-60">
            © {currentYear} مو جيمي — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
