/**
 * محتوى الـ Hero — Server Component بالكامل.
 * كل النصوص تُرسل مرئية في الـ HTML؛ الحركة تحسين CSS فوقها لا شرط لظهورها.
 *
 * 5B.1: المحتوى فقط — التخطيط والفئات كما هي (إعادة التصميم ليست من نطاق هذه المرحلة).
 * - الاسم والدور ونوع العمل صاروا فوق الطية.
 * - الصياغة بصيغة المفرد (مطوّر فردي، لا فريق).
 * - حُذفت الإحصائيات غير القابلة للإثبات وبقيت سنوات الخبرة المعتمدة.
 */
export const HeroContent = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      {/* الاسم — يشغل موضع البادج نفسه */}
      <div className="enter-rise flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border bg-surface backdrop-blur-md mb-8 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]" />
        {/*
          الاسم صار عربيًا في 7.1، فأُزيلت الخصائص اللاتينية:
          dir="ltr" (الاتجاه يُورَث من <html dir="rtl">)، و tracking الواسع
          الذي يفصل حروف الخط المتصل، و uppercase الذي لا أثر له في العربية.
          الحجم واللون والوزن والبنية كما هي.
        */}
        <span className="text-foreground-dim font-cairo text-[10px] md:text-xs font-black">
          محمد جمال
        </span>
      </div>

      {/* العنوان الرئيسي — مرشّح الـ LCP: transform فقط، opacity ثابتة عند 1 */}
      <h1 className="enter-lcp text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.4] md:leading-tight tracking-normal font-cairo text-balance">
        مطوّر ويب أبني <br className="hidden md:block" />
        <span className="hero-gradient-text text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto]">
          مواقع وأنظمة تعمل بإتقان.
        </span>
      </h1>

      {/* وصف قصير */}
      <p className="enter-rise enter-delay-2 max-w-lg mt-5 text-foreground-dim text-sm md:text-lg font-cairo font-light leading-relaxed px-4">
        من الفكرة حتى الإطلاق: واجهات نظيفة، أداء مدروس، وكود
        <span className="text-foreground mx-2 font-medium underline decoration-accent/40 underline-offset-8">
          قابل للصيانة
        </span>
        والتطوير.
      </p>

      {/* سنوات الخبرة */}
      <div className="enter-rise enter-delay-3 glass-light mt-9 flex items-stretch gap-1 rounded-2xl p-1.5">
        <div className="flex flex-col items-center px-5 sm:px-7 py-3">
          <span className="text-lg sm:text-2xl font-black font-cairo text-primary tabular-nums">
            +5
          </span>
          <span className="text-[9px] sm:text-[10px] text-foreground-dim font-cairo font-bold uppercase tracking-wide whitespace-nowrap">
            سنوات خبرة
          </span>
        </div>
      </div>
    </div>
  );
};
