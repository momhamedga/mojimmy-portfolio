import { ArrowUpLeft } from "lucide-react";
import { Project } from "@/types/project";

/**
 * بطاقة مشروع بعرض كامل — Server Component، صفر JavaScript.
 *
 * 5B.4: تحوّلت من بطاقة داخل شبكة 2×2 إلى صف أفقي كامل العرض.
 *
 * اتجاه ثابت لكل المشاريع: المنطقة البصرية أولًا في الـDOM (يمين في RTL،
 * أي عند بداية القراءة — نفس موضع الرقم في البطاقة القديمة)، والمحتوى بعدها.
 * بلا تبادل يمين/يسار: نقطة بدء القراءة لا تقفز بين مشروع وآخر، والإيقاع
 * البصري يأتي من لون المشروع ورقمه لا من عكس التخطيط.
 *
 * إتاحة:
 * - الرابط بقى على زر الدعوة وحده بدل تغليف البطاقة كلها: البطاقة بعرض
 *   كامل صارت هدف تركيز ضخم، والعنوان ما عادش متداخلًا داخل رابط.
 * - مشروع بلا رابط يفضل غير تفاعلي تمامًا — بلا href="#" (قرار Phase 4).
 * - كل الزخارف (التدرّج، النقش، الرقم، النقطة) aria-hidden.
 */
export function ProjectCard({ project }: { project: Project }) {
  const hasLink = Boolean(project.link);

  return (
    <div
      className="reveal group relative rounded-3xl border border-border bg-surface/60 backdrop-blur-md overflow-hidden transition-all duration-500 md:hover:border-(--project-color)/40 md:hover:shadow-xl md:focus-within:border-(--project-color)/40"
      style={{ "--project-color": project.color } as React.CSSProperties}
    >
      <div className="grid md:grid-cols-12">
        {/* المنطقة البصرية — زخرفية بالكامل، بديل عن صورة الغلاف */}
        <div
          aria-hidden="true"
          className="md:col-span-4 relative min-h-28 md:min-h-full flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-s border-border"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklch, ${project.color} 20%, transparent), transparent 70%)`,
          }}
        >
          {/* نقش منقّط — نفس لغة كروت الخدمات */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(${project.color} 1.5px, transparent 1.5px)`,
              backgroundSize: "14px 14px",
            }}
          />

          {/* رقم المشروع — العنصر البصري الرئيسي */}
          <span
            className="relative font-mono font-black leading-none text-6xl md:text-7xl lg:text-8xl tracking-tighter transition-transform duration-500 md:group-hover:scale-105"
            style={{ color: `color-mix(in oklch, ${project.color} 45%, transparent)` }}
          >
            {project.id}
          </span>

          {/* نقطة الاعتماد اللونية */}
          <span
            className="absolute top-4 end-4 w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: project.color, boxShadow: `0 0 12px ${project.color}` }}
          />
        </div>

        {/* المحتوى — الترتيب الدلالي: الفئة ثم العنوان ثم الوصف ثم التقنيات ثم الدعوة */}
        <div className="md:col-span-8 p-6 md:p-8 lg:p-10 flex flex-col gap-4 text-right">
          {project.category && (
            <span className="self-start text-[10px] font-black uppercase tracking-[0.25em] text-foreground-subtle">
              {project.category}
            </span>
          )}

          <h3
            dir="ltr"
            className="text-2xl md:text-3xl font-black font-cairo text-foreground tracking-tight text-right transition-colors duration-300 md:group-hover:text-(--project-color)"
          >
            {project.title}
          </h3>

          <p className="text-sm md:text-base text-foreground-dim leading-relaxed font-cairo max-w-2xl">
            {project.description}
          </p>

          <ul className="flex flex-wrap gap-2 pt-1">
            {project.tags?.map((tag) => (
              <li
                key={tag}
                className="text-[11px] font-bold uppercase tracking-wider text-foreground-dim border border-border-strong/40 px-3 py-1.5 rounded-full"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="pt-4 mt-auto border-t border-border">
            {hasLink ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`زيارة مشروع ${project.title} (يفتح في تبويب جديد)`}
                className="inline-flex items-center gap-3 min-h-11 text-sm font-bold font-cairo text-foreground-dim transition-colors duration-300 hover:text-(--project-color)"
              >
                زيارة المشروع
                <span
                  aria-hidden="true"
                  className="w-9 h-9 rounded-full border border-border-strong/40 flex items-center justify-center transition-all duration-300 group-hover:border-(--project-color)"
                >
                  <ArrowUpLeft
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            ) : (
              <span className="inline-flex items-center min-h-11 text-sm font-bold font-cairo text-foreground-subtle">
                قريباً
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
