"use client";

import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";

interface ServiceType {
  id: number | string;
  arabicTitle: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  tech: string[];
}

interface ServiceCardProps {
  service: ServiceType;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const accentColor = service.color || 'oklch(0.6 0.19 258)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: "easeOut" }}
      className="h-full"
    >
    <div
      className="group relative h-full rounded-3xl border border-border bg-surface/60 backdrop-blur-xl overflow-hidden p-7 md:p-8 flex flex-col transition-all duration-500 md:hover:-translate-y-1.5 md:hover:shadow-xl md:hover:border-(--accent)"
      style={{ '--accent': accentColor } as React.CSSProperties}
      dir="rtl"
    >
      {/* نقش زخرفي خفيف (نقاط) بلون الخدمة — التصميم المطلوب: زجاج + لون + نقش */}
      <div
        className="absolute -top-6 -left-6 w-32 h-32 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${accentColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "14px 14px",
        }}
      />

      {/* توهّج ركني هادئ بلون الخدمة */}
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-[80px] opacity-[0.12] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.2]"
        style={{ backgroundColor: accentColor }}
      />

      {/* الأيقونة */}
      <div
        className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform duration-500 md:group-hover:scale-105"
        style={{
          backgroundColor: `color-mix(in oklch, ${accentColor} 12%, transparent)`,
          borderColor: `color-mix(in oklch, ${accentColor} 25%, transparent)`,
          color: accentColor,
        }}
      >
        {service.icon}
      </div>

      <span className="relative z-10 text-[10px] font-mono font-black uppercase tracking-widest text-foreground-dim mb-2">
        Phase 0{index + 1}
      </span>

      <h3 className="relative z-10 text-xl md:text-2xl font-cairo font-black text-foreground leading-tight tracking-tight mb-3">
        {service.arabicTitle}
      </h3>

      <p className="relative z-10 text-sm text-foreground-dim font-cairo font-light leading-relaxed mb-5">
        {service.description}
      </p>

      <div className="relative z-10 flex flex-wrap gap-1.5 mb-6">
        {service.tech.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-foreground-dim bg-foreground/3 border border-border rounded-md"
          >
            {t}
          </span>
        ))}
      </div>

      <Link href="#contact" className="relative z-10 mt-auto flex items-center gap-3 group/link w-fit">
        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-300 group-hover/link:bg-foreground group-hover/link:text-background">
          <ArrowUpLeft size={16} className="transition-transform duration-300 group-hover/link:rotate-45" />
        </div>
        <span className="text-xs font-cairo font-bold text-foreground-dim transition-colors duration-300 group-hover/link:text-foreground">
          ابدأ مشروعك الآن
        </span>
      </Link>
    </div>
    </motion.div>
  );
}
