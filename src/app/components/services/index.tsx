"use client"
import { motion } from "framer-motion";
import { useRef } from "react";
import { ServiceCard } from "./ServiceCard";
import { SERVICES } from "@/src/constants/services";

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" ref={containerRef} className="relative bg-transparent">
      {/* 1. مقدمة سينمائية - تم تقليل الارتفاع للموبايل */}
      <div className="h-[60vh] md:h-[70vh] flex flex-col items-center justify-center text-center px-6 sticky top-0 z-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 md:space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/5 bg-white/[0.02]">
            <span className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">
              Capabilities
            </span>
          </div>
          <h2 className="text-5xl md:text-[12rem] font-cairo font-black text-white tracking-tighter leading-none">
            حلول <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/40 to-transparent">
              ذكية.
            </span>
          </h2>
        </motion.div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>

      {/* 2. منطقة الكروت */}
      <div className="relative z-10 space-y-[10vh] md:space-y-0">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      {/* 3. سكشن انتقالي */}
      <div className="h-[30vh] md:h-[40vh] flex flex-col items-center justify-center bg-transparent relative z-20 px-6 text-center">
         <h4 className="text-white/10 font-cairo text-xl md:text-5xl font-bold italic">
            هل أنت مستعد لبناء المستقبل؟
         </h4>
      </div>
    </section>
  );
}