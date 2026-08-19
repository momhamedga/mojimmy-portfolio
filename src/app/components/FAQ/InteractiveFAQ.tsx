import { ChevronDown } from "lucide-react";
import { FAQ_DATA } from "@/constants/faq-data";

/**
 * قسم "إجابات سريعة" — Server Component بالكامل، صفر JavaScript.
 *
 * 5B.7: كان القسم يتنكّر في هيئة محادثة حيّة مع مساعد ذكاء اصطناعي:
 * "MoJimmy AI" و "Active Now" ونقطة اتصال خضراء ومؤشّر كتابة و"AI is thinking"
 * و"Solution Delivered" وحقل إدخال وزر إرسال زخرفيَّين، وتأخير 800ms مصطنع
 * قبل ظهور كل إجابة. لا شيء من ذلك كان حقيقيًا: البيانات ثابتة في faq-data.ts.
 *
 * الأهم أن ثلاث إجابات من أربع لم تكن في الـDOM أصلًا — تُرسم فقط عند اختيار
 * السؤال — فلا محرك بحث ولا قارئ شاشة ولا مستخدم بلا JavaScript يصل إليها.
 *
 * البديل: <details>/<summary> الأصلية. لوحة مفاتيح وحالة معلنة وفتح متعدد
 * بلا حالة عميل ولا مؤقّتات ولا مكتبة accordion، وكل الإجابات في HTML الأولي.
 */
export default function InteractiveFAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
      {/* توهّج خلفي هادئ وثابت */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-3xl max-h-3xl bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"
      />

      <div className="container mx-auto px-6">
        {/* عرض قراءة مريح — القسم نصّي بحت، لا يحتاج عرض الصفحة كاملًا */}
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-12 md:mb-14">
            <span className="text-primary font-cairo font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase block mb-5">
              Quick Answers
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground font-cairo leading-tight tracking-tight">
              إجابات{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-l from-primary to-accent">
                سريعة.
              </span>
            </h2>

            <p className="mt-5 text-sm md:text-base text-foreground-dim font-cairo leading-relaxed">
              إجابات مختصرة على أكثر الأسئلة شيوعًا قبل بدء المشروع.
            </p>
          </div>

          <div className="reveal flex flex-col gap-3">
            {FAQ_DATA.map((item, index) => (
              <FaqItem key={item.question} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ item, index }: { item: (typeof FAQ_DATA)[number]; index: number }) {
  return (
    <details className="group rounded-2xl border border-border bg-surface/60 backdrop-blur-sm transition-colors duration-300 open:border-primary/40 md:hover:border-border-strong">
      {/*
        <summary> أصلي: قابل للتركيز ويستجيب لـEnter/Space بلا أي معالج،
        ويعلن حالته بنفسه. لذلك بلا role ولا tabIndex ولا aria-expanded يدوي.
        list-none + ::-webkit-details-marker لإخفاء المثلث الافتراضي فقط،
        بلا مساس بالدلالة.
      */}
      <summary className="flex items-center gap-4 min-h-14 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="w-6 shrink-0 font-mono text-xs font-black tabular-nums text-foreground-subtle"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="flex-1 min-w-0 text-sm md:text-base font-bold font-cairo text-foreground leading-snug">
          {item.question}
        </span>

        <ChevronDown
          aria-hidden="true"
          size={18}
          className="shrink-0 text-foreground-dim transition-transform duration-300 group-open:rotate-180"
        />
      </summary>

      <div className="ps-5 md:ps-15 pe-5 pb-5">
        <p className="text-sm md:text-base text-foreground-dim font-cairo leading-relaxed">
          {item.answer}
        </p>
      </div>
    </details>
  );
}
