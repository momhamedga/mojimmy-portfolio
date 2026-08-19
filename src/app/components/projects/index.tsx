import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/constants/projects";

/**
 * Server Component — عرض رأسي للمشاريع، محتوى ثابت بالكامل بصفر JavaScript.
 *
 * 5B.4: شبكة 2×2 → مكدّس بعرض كامل. المشاريع أهم دليل في الموقع،
 * فأخذت حضورًا بصريًا أكبر بدل بطاقتين متجاورتين ضيّقتين.
 */
export default function Projects() {
  return (
    <section
      id="projects"
      dir="rtl"
      className="py-24 md:py-32 relative bg-transparent overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* الهيدر */}
        <div className="reveal mb-14 md:mb-16 text-center">
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
        </div>

        {/* عرض رأسي — بطاقة بعرض كامل لكل مشروع */}
        <div className="flex flex-col gap-8 md:gap-10">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
