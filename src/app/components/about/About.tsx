import { EXPERTISE } from "@/constants/expertise";
import { ExpertiseBlock } from "./ExpertiseBlock";

/**
 * قسم "عني" — Server Component بالكامل، صفر JavaScript.
 *
 * أُعيد بناؤه في 5B.3 ودُمج داخله قسم التقنيات المستقل:
 * - كان "use client" بسبب useScroll + useSpring اللي كانا يغذّيان الكشف
 *   كلمة-بكلمة و شريط "Execution Level". الاثنان أُزيلا.
 * - النص العملاق (text-5xl مقسّم 40 كلمة) صار مقدمة قصيرة مقروءة فورًا.
 * - "Story Mode" و "Execution Level" و الـspotlight المتحرك أُزيلوا.
 * - الحشو الرأسي من py-20 md:py-72 إلى py-24 md:py-32.
 * - جدار شعارات التقنيات صار ثلاث مجموعات خبرة تدعم المقدمة.
 *
 * الحركة: الكشف عند السكرول بـ.reveal (CSS خالص، يحترم prefers-reduced-motion،
 * والحالة الأساسية مرئية فلا يعتمد المحتوى على JavaScript).
 */
export default function About() {
  return (
    <section
      dir="rtl"
      className="relative py-24 md:py-32 overflow-hidden bg-transparent"
      id="about"
    >
      {/* توهّج خلفي هادئ وثابت — بلا حركة مربوطة بالسكرول */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-0 w-[70vw] md:w-125 h-[70vw] md:h-125 bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* المحتوى: التعريف والقيمة */}
          <div className="reveal lg:col-span-5 text-right">
            <span className="text-primary font-cairo font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase block mb-5">
              About
            </span>

            <h2 className="text-3xl md:text-4xl font-cairo font-black text-foreground leading-[1.35] tracking-tight">
              أبني تجارب ويب سريعة، واضحة،{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-l from-primary to-accent">
                وقابلة للتوسّع.
              </span>
            </h2>

            <p className="mt-6 text-foreground-dim text-sm md:text-base font-cairo leading-relaxed">
              أنا <span className="text-foreground font-bold">محمد جمال</span>، مطوّر ويب أعمل على
              بناء المواقع والتطبيقات والأنظمة الحديثة، من الواجهة إلى الـBackend، مع اهتمام بالأداء
              وسهولة الاستخدام وجودة الكود.
            </p>

            <p className="mt-4 text-foreground-dim text-sm md:text-base font-cairo leading-relaxed">
              أستخدم تقنيات حديثة لبناء حلول عملية قابلة للصيانة والتطوير، وأستفيد من تكاملات الذكاء
              الاصطناعي عندما تضيف قيمة حقيقية للمشروع.
            </p>

            {/* دليل الخبرة — عنصر مساند صغير، ليس شريط إحصائيات */}
            <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-border bg-surface/60 backdrop-blur-md px-5 py-3">
              <span className="text-2xl font-black font-cairo text-primary tabular-nums leading-none">
                +5
              </span>
              <span className="text-xs font-cairo font-bold text-foreground-dim leading-snug">
                سنوات خبرة
                <br />
                في تطوير الويب
              </span>
            </div>
          </div>

          {/* مجموعات الخبرة — مكدّسة رأسيًا لسهولة المسح البصري في RTL */}
          <div className="reveal lg:col-span-7 flex flex-col gap-4 md:gap-5">
            {EXPERTISE.map((group) => (
              <ExpertiseBlock
                key={group.id}
                id={group.id}
                title={group.title}
                items={group.items}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
