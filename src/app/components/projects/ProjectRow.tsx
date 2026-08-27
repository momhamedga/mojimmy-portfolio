import Image from "next/image";
import { ArrowUpLeft } from "lucide-react";

import { Project } from "@/types/project";
import { PROJECT_PREVIEWS } from "./previews";

/**
 * مدخل دراسة حالة لمشروع — Server Component، صفر JavaScript.
 *
 * الدليل البصري هو لقطة حقيقية من الموقع المنشور نفسه، لا لوحة زخرفية ولا
 * إطار متصفح مزيّف ولا رسم مولّد. البطاقة الزجاجية القديمة والجدول التقني
 * الذي سبقه أُزيلا معًا: الأولى كانت غلافًا يتحمّل قبل محتواه، والثاني كان
 * يقرأ كتوثيق لا كعمل.
 *
 * التبادل على الديسكتوب (نص/معاينة ثم معاينة/نص) يتم بموضعة أعمدة الشبكة
 * فقط. ترتيب الـDOM ثابت لا يتبدّل أبدًا: رقم، فئة، اسم، وصف، تقنيات،
 * دعوة، معاينة — فترتيب القراءة والتنقّل بلوحة المفاتيح واحد على كل مقاس.
 *
 * لا حركة دخول ولا ViewTimeline ولا ضبابية ولا ظل: المحتوى مرئي بالكامل
 * لحظة وجوده في الصفحة، فالعيب القديم (الظهور المتأخر) مستحيل بالبنية.
 */

/** تفاوت محسوب في مقياس النص — تنويع بشري بلا عشوائية. */
const MEASURE = ["max-w-[54ch]", "max-w-[48ch]", "max-w-[54ch]", "max-w-[46ch]", "max-w-[52ch]"];

/** النطاق المنشور، مشتق من الرابط نفسه — حقيقة لا ادّعاء. */
function domainOf(link: string): string | undefined {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const hasLink = Boolean(project.link);
  const preview = PROJECT_PREVIEWS[project.id];
  const domain = hasLink ? domainOf(project.link) : undefined;
  const measure = MEASURE[index % MEASURE.length];

  // التبادل بصريًا فقط: الفردي نص ثم معاينة، والزوجي معاينة ثم نص.
  //
  // `row-start-1` ضروري لا تجميلي: في الصفوف المعكوسة تسبق المعاينة النصَّ
  // في ترتيب الأعمدة بينما تليه في الـDOM، والتوزيع التلقائي المتناثر لا
  // يرجع إلى الخلف فيدفعها إلى صف جديد. تثبيت الصف يُبقيهما جنبًا إلى جنب
  // دون المساس بترتيب القراءة.
  //
  // النسبة 5:6 — أي نص ≈٤٥٪ ومعاينة ≈٥٥٪. الشبكة من ١١ عمودًا لا ١٢: العمود
  // الفارغ الذي كان يفصلهما ضاعف المسافة المدركة إلى ١٥٥px فبدا النص معزولًا
  // عن صورة مشروعه. الآن الفاصل هو فجوة الشبكة وحدها، فيُقرأ الاثنان كعمل
  // واحد دون أن يلتصقا.
  const flipped = index % 2 === 1;
  const textPlacement = flipped
    ? "lg:row-start-1 lg:col-start-7 lg:col-span-5"
    : "lg:row-start-1 lg:col-start-1 lg:col-span-5";
  const shotPlacement = flipped
    ? "lg:row-start-1 lg:col-start-1 lg:col-span-6"
    : "lg:row-start-1 lg:col-start-6 lg:col-span-6";

  return (
    <article
      className="group pb-12 md:pb-16"
      style={
        {
          "--project-color": project.color,
          // لون متاح: يُمزج نحو لون النص، فيغمق في الوضع الفاتح ويفتح في الداكن.
          "--project-accent": `color-mix(in srgb, ${project.color} 80%, var(--color-foreground))`,
        } as React.CSSProperties
      }
    >
      {/* فاصل الفصول: قاعدة رفيعة يفتتحها مقطع بلون المشروع، فيُقرأ التتابع
          كفصول مقصودة لا كتكرار. مبني من عنصرين متجاورين لا من طبقة مطلقة. */}
      <div aria-hidden="true" className="mb-8 flex items-center md:mb-10">
        <span className="h-px w-16 md:w-24" style={{ backgroundColor: "var(--project-accent)" }} />
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-y-8 lg:grid-cols-11 lg:gap-x-10 lg:items-center">
        {/* النص.
            أفقيًا: الكتلة أضيق من عمودها، والاتجاه RTL يلصقها بحافة البدء —
            أي بالحافة الأبعد عن اللقطة حين تكون اللقطة يسارًا. القياس أثبتها
            فجوة مدركة ١٠٥–١٣٠px مقابل ٤٨px في الصفوف المعكوسة. المقياس على
            الحاوية نفسها مع `ms-auto` يدفع الفراغ إلى الحافة الخارجية بدل أن
            يقع بين النص وصورة مشروعه، فيتساوى الصفّان المتبادلان.
            رأسيًا: الكتلة أثقل من أعلى (رقم ثم عنوان ضخم)، فالتوسيط الحسابي
            يجعلها تبدو هابطة؛ الهامش السفلي يرفعها نصفه فوق مركز اللقطة. */}
        <div
          className={`${measure} lg:mb-14 xl:mb-24 ${flipped ? "" : "lg:ms-auto"} ${textPlacement}`}
        >
          <div className="flex items-baseline gap-3">
            <span
              dir="ltr"
              className="font-mono text-lg font-black leading-none tracking-tight"
              style={{ color: "var(--project-accent)" }}
            >
              {project.id}
            </span>

            {project.category && (
              <span className="font-cairo text-xs font-bold tracking-wide text-foreground-subtle">
                {project.category}
              </span>
            )}
          </div>

          <h3
            dir="ltr"
            className="mt-4 font-cairo text-3xl md:text-4xl font-black uppercase leading-[1.05] tracking-tight text-foreground text-right transition-colors duration-300 md:group-hover:text-(--project-accent)"
          >
            {project.title}
          </h3>

          <p className="mt-5 font-cairo text-sm md:text-base leading-relaxed text-foreground-dim">
            {project.description}
          </p>

          {/* التقنيات كـmetadata مفصولة بشرطات — لا أقراص ولا أزرار */}
          <p
            dir="ltr"
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground-subtle text-right"
          >
            {project.tags.join("  /  ")}
          </p>

          {hasLink ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`زيارة مشروع ${project.title} (يفتح في تبويب جديد)`}
              className="mt-7 inline-flex items-center gap-2 min-h-11 font-cairo text-sm font-bold text-foreground underline-offset-4 transition-colors duration-300 hover:underline"
            >
              زيارة المشروع
              <ArrowUpLeft
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:-translate-x-0.5"
              />
            </a>
          ) : (
            <span className="mt-7 inline-flex items-center min-h-11 font-cairo text-sm font-bold text-foreground-subtle">
              قريباً
            </span>
          )}
        </div>

        {/* المعاينة الحقيقية */}
        {preview && (
          // سقف عرض دون lg: التخطيط مكدّس هناك، فالمعاينة بعرض الحاوية كاملًا
          // كانت تضخّم ارتفاع القسم على التابلت. السقف لا يؤثّر تحت 560px
          // (الموبايل أضيق منه أصلًا) ويرتفع تمامًا عند lg.
          <figure className={`mx-auto w-full max-w-140 lg:mx-0 lg:max-w-none ${shotPlacement}`}>
            <div className="overflow-hidden rounded-xl border border-border">
              <Image
                src={preview}
                alt={`معاينة الصفحة الرئيسية لموقع ${project.title}`}
                sizes="(min-width: 1024px) 50vw, (min-width: 600px) 560px, 100vw"
                className="block h-auto w-full"
              />
            </div>

            {/* تسمية الشكل: النطاق تحت اللقطة مباشرة ومحاذٍ لحافتها، فيُقرأ
                الاثنان شكلًا واحدًا. كان فوقها بمسافة تجعله يبدو عائمًا. */}
            {domain && (
              <figcaption
                dir="ltr"
                className="mt-2.5 text-right font-mono text-[11px] tracking-wide text-foreground-subtle"
              >
                {domain}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </article>
  );
}
