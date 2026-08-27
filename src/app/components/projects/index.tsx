import { ProjectRow } from "./ProjectRow";
import { PROJECTS } from "@/constants/projects";

/**
 * Server Component — فهرس أعمال تحريري، محتوى ثابت بالكامل بصفر JavaScript.
 *
 * 5B.4: شبكة 2×2 → بطاقات بعرض كامل.
 * إعادة التصميم الحالية: بطاقات زجاجية → فهرس تحريري بقواعد أفقية رفيعة.
 *
 * القسم لم يعد يملك أي عنصر `.reveal`: ظهور المحتوى لا يعتمد على تقدّم
 * السكرول إطلاقًا. العدد مشتق من طول المصفوفة لا مكتوبًا يدويًا، فلا يمكن
 * أن يتخلّف عن البيانات عند إضافة مشروع.
 */
export default function Projects() {
  const count = String(PROJECTS.length).padStart(2, "0");

  return (
    <section
      id="projects"
      dir="rtl"
      className="py-24 md:py-32 relative bg-transparent overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <header className="mb-14 md:mb-20">
          <div className="flex items-baseline gap-4">
            <h2 className="font-cairo text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
              مشاريع{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                مختارة
              </span>
            </h2>

            <span
              dir="ltr"
              className="font-mono text-sm md:text-base font-bold tracking-widest text-foreground-subtle"
            >
              / {count}
            </span>
          </div>

          <p className="mt-5 max-w-[46ch] font-cairo text-base md:text-lg leading-relaxed text-foreground-dim">
            مش مجرد واجهات، دي مواقع وأنظمة اتبنت واتشغلت.
          </p>
        </header>

        {/* الفهرس — كل مشروع يفتتحه خطّ فاصل، وخطّ أخير يغلق القائمة */}
        <div className="border-b border-border">
          {PROJECTS.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
