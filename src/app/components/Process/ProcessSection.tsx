import { PROCESS_STEPS, type ProcessStep } from "@/constants/process-steps";

/**
 * قسم "طريقة العمل" — Server Component، صفر JavaScript.
 *
 * 5B.6: خط زمني رأسي بلا تبادل جهات، والتسلسل محمول في <ol> كمعنى دلالي.
 *
 * تصحيح بصري 5B.6:
 * - كان بين المسار والكارت فراغ بلا رابط بصري، فبدت النقطة منفصلة عن الكارت.
 *   أُضيف واصل أفقي قصير يلمس حافة الكارت: ●──── Card.
 * - رأس الكارت كان justify-between فيطير الرقم لأقصى الطرف المقابل للأيقونة
 *   ويترك فجوة فارغة وسط الكارت. الرقم والأيقونة والعنوان بقوا مجموعة واحدة.
 * - المسار كان تدرّجًا primary→accent ينمو مع السكرول، فيبدو كمؤشّر تقدّم
 *   لخطوة نشطة بينما لا توجد حالة نشطة حقيقية. بقى خطًا هادئًا واحدًا بلون الحدود.
 * - نبض النقاط المستمر أُزيل: النقاط دليل بنيوي لا عنصر تفاعلي.
 *
 * المسار كله زخرفي (aria-hidden) — الترتيب يعلنه <ol>/<li> وحدهما.
 */
export default function ProcessSection() {
  return (
    <section id="process" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* مقدمة القسم */}
        <div className="reveal text-center mb-14 md:mb-16">
          <span className="text-primary font-cairo font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase block mb-5">
            Engineering Workflow
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground font-cairo leading-tight tracking-tight">
            رحلة تحويل{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-l from-primary to-accent">
              الفكرة
            </span>{" "}
            لواقع
          </h2>
        </div>

        {/* الخط الزمني — عرض مضبوط: الكارت ~832px على الشاشات الكبيرة */}
        <ol className="relative max-w-4xl mx-auto">
          {PROCESS_STEPS.map((step) => (
            <StepItem key={step.id} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepItem({ step }: { step: ProcessStep }) {
  const Icon = step.icon;

  return (
    <li className="reveal group relative ps-10 md:ps-16 pb-5 md:pb-6 last:pb-0">
      {/* قطعة المسار الرأسية — تمتد من مركز هذه النقطة إلى مركز النقطة التالية،
          وتختفي عند آخر خطوة فلا يمتد الخط في فراغ. */}
      <span
        aria-hidden="true"
        className="absolute start-[11px] md:start-[15px] top-11 -bottom-11 md:top-12 md:-bottom-12 w-0.5 bg-border group-last:hidden pointer-events-none"
      />

      {/* النقطة + الواصل الأفقي — صف واحد فيتوسّطان رأسيًا بعضهما تلقائيًا */}
      <span
        aria-hidden="true"
        className="absolute start-0 top-8 flex items-center h-6 md:h-8 pointer-events-none"
      >
        <span className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center shrink-0">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-primary bg-background" />
        </span>
        <span className="h-px w-4 md:w-8 bg-border" />
      </span>

      <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur-md p-5 md:p-6 transition-colors duration-500 md:hover:border-primary/40">
        {/* هوية الخطوة كتلة واحدة: رقم ثم أيقونة ثم عنوان */}
        <div className="flex items-center gap-3 md:gap-4 mb-3">
          <span
            aria-hidden="true"
            className="font-mono text-xl md:text-2xl font-black tabular-nums leading-none text-foreground-subtle shrink-0"
          >
            {step.id}
          </span>

          <span
            aria-hidden="true"
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--color-primary-transparent)",
              border: "1px solid var(--color-primary-faded)",
            }}
          >
            <Icon size={22} className="text-primary" />
          </span>

          <h3 className="min-w-0 text-lg md:text-xl font-black text-foreground font-cairo tracking-tight">
            {step.title}
          </h3>
        </div>

        <p className="text-sm md:text-base text-foreground-dim font-cairo leading-relaxed">
          {step.desc}
        </p>
      </div>
    </li>
  );
}
