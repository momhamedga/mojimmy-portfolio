"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ServiceCard } from "./ServiceCard";
import { SERVICES } from "@/src/constants/services";

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" ref={containerRef} className="relative bg-transparent">
      {/* 1. مقدمة سينمائية */}
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6 sticky top-0 z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <span className="text-[oklch(0.7_0.2_285)] font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">
              Capabilities
            </span>
          </div>
          <h2 className="text-7xl md:text-[12rem] font-cairo font-black text-white tracking-tighter leading-none select-none">
            حلول <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/50 to-transparent opacity-80">
              ذكية.
            </span>
          </h2>
        </motion.div>
        
        {/* مؤشر سكرول مودرن */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          <span className="font-mono text-[9px] uppercase tracking-widest">Scroll</span>
        </div>
      </div>

      {/* 2. منطقة الكروت (Stacking Effect) */}
      <div className="relative z-10">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      {/* 3. سكشن انتقالي (Outro) */}
      <div className="h-[40vh] flex flex-col items-center justify-center border-t border-white/5 bg-transparent relative z-20">
         <h4 className="text-white/10 font-cairo text-2xl md:text-5xl font-bold italic">
           هل أنت مستعد لبناء المستقبل؟
         </h4>
      </div>
    </section>
  );
}