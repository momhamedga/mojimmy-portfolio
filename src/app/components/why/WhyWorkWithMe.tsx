import { WORK_PRINCIPLES } from "@/constants/work-principles";

/**
 * قسم "لماذا تعمل معي؟" — Server Component، صفر JavaScript.
 *
 * 5B.8: حلّ محل قسم "شركاء النجاح" الذي كان يعرض خمس شهادات غير حقيقية
 * (أسماء ومناصب ودول مُختلقة، خمس نجوم لكل بطاقة، شارة "Platinum Partner"،
 * وادّعاء "زيادة سرعة الموقع بنسبة 200%")، فوق بطاقات بحركة JavaScript
 * وتتبّع مؤشّر وأعلام دول من نطاق خارجي.
 *
 * القسم الجديد لا يمدح أحدًا: يشرح طريقة العمل وقيمتها للعميل بصيغة المتكلّم،
 * بلا ادّعاءات مطلقة ولا أرقام غير مثبتة.
 *
 * التمييز البصري: شبكة 2×2 وحدها في الصفحة — المشاريع والخدمات مكدّسة رأسيًا،
 * وطريقة العمل خط زمني، والأسئلة أكورديون. الشبكة تكسر الإيقاع الرأسي المتتابع
 * بين "طريقة العمل" و"الأسئلة". وبطاقاتها أخف: بلا أيقونات ولا وسوم تقنية
 * ولا دعوة لاتخاذ إجراء ولا لوحة تدرّج — رقم وعنوان وخط فاصل ونص.
 *
 * <ul> لا <ol>: المبادئ ليست تسلسلًا زمنيًا (بعكس "طريقة العمل").
 */
export default function WhyWorkWithMe() {
  return (
    <section id="why" dir="rtl" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* أعرض من "طريقة العمل" و"الأسئلة" — الشبكة تحتاج مساحة عمودين */}
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-14 md:mb-16">
            <span className="text-primary font-cairo font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase block mb-5">
              Work Principles
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground font-cairo leading-tight tracking-tight">
              لماذا تعمل{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-l from-primary to-accent">
                معي؟
              </span>
            </h2>
          </div>

          <ul className="reveal grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {WORK_PRINCIPLES.map((principle) => (
              <li
                key={principle.id}
                className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8 transition-colors duration-300 md:hover:border-primary/30"
              >
                <span
                  aria-hidden="true"
                  className="block font-mono text-xs font-black tracking-[0.3em] text-primary mb-4"
                >
                  {principle.id}
                </span>

                <h3 className="text-lg md:text-xl font-black font-cairo text-foreground tracking-tight">
                  {principle.title}
                </h3>

                <div aria-hidden="true" className="h-px w-full bg-border my-4" />

                <p className="text-sm md:text-base text-foreground-dim font-cairo leading-relaxed">
                  {principle.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
