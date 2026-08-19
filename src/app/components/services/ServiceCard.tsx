import type { Service } from "@/constants/services";

/**
 * صف خدمة بعرض كامل — Server Component، صفر JavaScript.
 *
 * 5B.5: تحوّل من بطاقة داخل شبكة 3 أعمدة إلى صف كامل العرض.
 * الشبكة كانت تترك بطاقة يتيمة (5 خدمات في 3 أعمدة) وتضغط الوصف والتقنيات.
 *
 * تمييز مقصود عن المكوّنين المجاورين:
 * - عن ExpertiseBlock (في "عني"): هنا وصف وأيقونة ولون خاص بالخدمة ورقم أكبر.
 *   هناك إثبات قدرة مضغوط بلا وصف ولا أيقونة ولا لون.
 * - عن ProjectCard: بلا لوحة بصرية 33% وبلا دعوة لاتخاذ إجراء وبلا فئة.
 *   الخدمات ليست معرضًا بل بيان قدرات.
 *
 * البطاقة **غير تفاعلية**: لا رابط ولا زر ولا cursor-pointer.
 * الدعوة العامة مكانها قسم التواصل، وتكرارها خمس مرات هنا ضجيج.
 */
export function ServiceCard({ service }: { service: Service }) {
  const accent = service.color;

  return (
    <div
      className="reveal group relative rounded-3xl border border-border bg-surface/60 backdrop-blur-md overflow-hidden p-6 md:p-8 transition-colors duration-500 md:hover:border-(--accent)"
      style={{ "--accent": accent } as React.CSSProperties}
      dir="rtl"
    >
      {/* نقش زخرفي ركني — خُفّف لأن البطاقة صارت أعرض بكثير */}
      <div
        aria-hidden="true"
        className="absolute -top-5 -left-5 w-24 h-24 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${accent} 1.5px, transparent 1.5px)`,
          backgroundSize: "14px 14px",
        }}
      />

      {/* توهّج ركني هادئ بلون الخدمة */}
      <div
        aria-hidden="true"
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-[80px] opacity-[0.1] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.18]"
        style={{ backgroundColor: accent }}
      />

      <div className="relative z-10 flex flex-col md:flex-row gap-5 md:gap-6">
        {/* الأيقونة — زخرفية، العنوان يحمل المعنى */}
        <span
          aria-hidden="true"
          className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-500 md:group-hover:scale-105"
          style={{
            backgroundColor: `color-mix(in oklch, ${accent} 12%, transparent)`,
            borderColor: `color-mix(in oklch, ${accent} 25%, transparent)`,
            color: accent,
          }}
        >
          {service.icon}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-3xl md:text-4xl font-black tabular-nums leading-none"
              style={{ color: `color-mix(in oklch, ${accent} 65%, transparent)` }}
            >
              {service.id}
            </span>

            <h3 className="min-w-0 text-xl md:text-2xl font-cairo font-black text-foreground leading-tight tracking-tight">
              {service.arabicTitle}
            </h3>
          </div>

          <p className="mt-3 text-sm md:text-base text-foreground-dim font-cairo leading-relaxed max-w-3xl">
            {service.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {service.tech.map((t) => (
              <li
                key={t}
                className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-foreground-dim bg-foreground/5 border border-border rounded-md"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
