"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/src/constants/projects";

export default function Projects() {
  return (
    <section id="projects" dir="rtl" className="py-24 md:py-32 relative bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">

        {/* الهيدر */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-14 md:mb-16 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-primary shadow-[0_0_10px_var(--color-primary)]" />
            <span className="text-foreground-dim font-cairo text-[10px] md:text-xs tracking-[0.3em] font-black uppercase">
              Featured Work
            </span>
            <div className="h-px w-8 bg-primary shadow-[0_0_10px_var(--color-primary)]" />
          </div>

          <h2 className="font-cairo text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            مشاريع{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              مختارة.
            </span>
          </h2>
        </motion.div>

        {/* شبكة المشاريع */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
