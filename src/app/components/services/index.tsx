"use client"
import { motion } from "framer-motion";
import { ServiceCard } from "./ServiceCard";
import { SERVICES } from "@/src/constants/services";

export default function Services() {
  return (
    <section id="services" className=" relative">
      {/* سكشن العنوان التمهيدي */}
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <span className="text-purple-500 font-mono tracking-[0.4em] text-xs md:text-sm uppercase">
             ما نبرع فيه
          </span>
          <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none">
            خدماتنا <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">الإبداعية</span>
          </h2>
        </motion.div>
      </div>

      {/* الـ Cards التفاعلية */}
      <div className="relative">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      {/* Footer بسيط للسكشن */}
      <div className="h-[30vh] flex items-center justify-center border-t border-white/5">
         <p className="text-white/20 font-mono text-sm tracking-widest animate-pulse">
           اسحب للأعلى لاستكشاف المزيد
         </p>
      </div>
    </section>
  );
}