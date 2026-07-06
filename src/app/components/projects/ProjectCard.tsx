"use client";

import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { Project } from "@/src/types/project";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const hasLink = Boolean(project.link);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link
        href={project.link || "#"}
        target={hasLink ? "_blank" : undefined}
        rel={hasLink ? "noopener noreferrer" : undefined}
        className="group block h-full"
      >
        <div
          className="relative h-full rounded-3xl border border-border bg-surface/60 backdrop-blur-xl overflow-hidden transition-all duration-500 md:group-hover:-translate-y-1.5 md:group-hover:shadow-xl"
          style={{ '--project-color': project.color } as React.CSSProperties}
        >
          {/* شريط الغلاف العلوي — بلون المشروع نفسه، بديل عن صورة الغلاف */}
          <div
            className="relative h-24 md:h-28 flex items-center justify-between px-6 overflow-hidden transition-colors duration-500 border-b border-border md:group-hover:border-(--project-color)/30"
            style={{ background: `linear-gradient(135deg, color-mix(in oklch, ${project.color} 18%, transparent), transparent)` }}
          >
            <span className="text-4xl md:text-5xl font-black font-mono text-foreground/10">
              {project.id.toString().padStart(2, '0')}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: project.color, boxShadow: `0 0 12px ${project.color}` }}
            />
          </div>

          {/* المحتوى */}
          <div className="p-6 md:p-7 flex flex-col gap-4 text-right" dir="rtl">
            <h3 className="text-xl md:text-2xl font-black font-cairo text-foreground tracking-tight md:group-hover:text-(--project-color) transition-colors duration-300">
              {project.title}
            </h3>

            <p className="text-sm text-foreground-dim leading-relaxed font-cairo font-light">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold uppercase tracking-wider text-foreground-dim border border-border px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
              <span className="text-xs font-bold text-foreground-dim md:group-hover:text-foreground transition-colors duration-300">
                {hasLink ? "زيارة المشروع" : "قريباً"}
              </span>
              <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center md:group-hover:border-(--project-color) transition-all duration-300">
                <ArrowUpLeft size={15} className="text-foreground-dim md:group-hover:text-(--project-color) transition-all duration-300 md:group-hover:-translate-y-0.5 md:group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
