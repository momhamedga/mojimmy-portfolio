"use client";

import { motion } from "framer-motion";
import { ServiceCard } from "./ServiceCard";
import { SERVICES } from "@/src/constants/services";

export default function Services() {
  return (
    <section id="services" className="relative bg-transparent w-full py-24 md:py-32">
      <div className="container mx-auto px-6">

        {/* 1. مقدمة القسم */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-14 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-border bg-surface mb-5">
            <span className="font-mono font-black text-[10px] md:text-xs uppercase tracking-[0.4em] text-primary">
              Capabilities
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cairo font-black text-foreground tracking-tight">
            حلول{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              ذكية.
            </span>
          </h2>
        </motion.div>

        {/* 2. شبكة الخدمات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
