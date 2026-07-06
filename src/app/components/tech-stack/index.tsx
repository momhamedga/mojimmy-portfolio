"use client";

import { motion } from "framer-motion";
import TechIcon from "./TechIcon";
import { TECH_STACK } from "@/src/constants/tech-data";

export default function TechStack() {
  return (
    <section id="tech-stack" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* الهيدر */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="text-primary font-cairo font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase block mb-4">
            Tech Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-cairo text-foreground tracking-tight">
            الأدوات اللي بنبني بيها{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              المستقبل
            </span>
          </h2>
        </motion.div>

        {/* شبكة التقنيات — بديل عن الأيقونات الدوّارة، مناسب للموبايل والديسكتوب بنفس الشكل */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {TECH_STACK.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            >
              <TechIcon name={tech.name} icon={tech.icon} color={tech.color} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
