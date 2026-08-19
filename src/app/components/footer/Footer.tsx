import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SmoothScrollLink from "../SmoothScrollLink";
import { Logo } from "../Layouts/Logo";
import { navLinks } from "@/constants/navLinks";
import { CONTACT_EMAIL } from "@/constants/site";

/** نفس رابط زر واتساب العائم — لم يُنشأ رقم جديد. */
const WHATSAPP_URL = "https://wa.me/+971589915968";

const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com/momhamedga" },
  { name: "Facebook", href: "https://www.facebook.com/midoga20/" },
  { name: "Instagram", href: "https://www.instagram.com/jimmy_mo98/" },
];

/**
 * Server Component — القسم الختامي. صفر JavaScript عدا SmoothScrollLink.
 *
 * 5B.10 / 5B.10.1: حُذفت ساعة LocalTime وشارة التوفّر وسطر الموقع وغلاف
 * Magnetic، وثُبّتت سنة الحقوق، وأُصلح تباين سطر الحقوق، وزال الزجاج والضبابية.
 *
 * 5B.10.2 — إعادة تركيب بصرية:
 * - كان العنوان والنص في أقصى جهة والزر في الجهة المقابلة، فلم يُقرأ الثلاثة
 *   كوحدة تحويل واحدة. الزر الآن أسفل النص مباشرة: عنوان ← وصف ← زر، مسار واحد.
 * - المنطقة الخدمية كانت ثلاثة أعمدة مفرودة على كامل العرض بفراغ أفقي كبير.
 *   بقت صفًا مرنًا متلاصقًا (flex-wrap بمسافات محددة) لا يتمدّد ليملأ العرض.
 * - الروابط الستة كانت عمودًا رأسيًا طويلًا يشبه خريطة موقع. بقت شبكة 2×3 مضغوطة.
 * - كتلة الهوية كانت شعارًا كبيرًا معزولًا. صارت عنقودًا صغيرًا: علامة + اسم + دور.
 * - لمسة زخرفية واحدة فقط: خط تدرّج العلامة (أحمر→بنفسجي→أزرق) أعلى الفوتر.
 *   بلا نقش ولا توهّج ولا خلفية متحركة.
 * - خلفية هادئة (bg-surface/40) تفصل الفوتر عن الصفحة وتخلق إغلاقًا بصريًا،
 *   بلا أي مادة كارت للبيان الختامي.
 */
export default function Footer() {
  return (
    <footer id="footer" dir="rtl" className="relative bg-surface/40 pt-20 md:pt-24 pb-10">
      {/* اللمسة الزخرفية الوحيدة — خط تدرّج العلامة */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-linear-to-l from-accent/60 via-primary/60 to-transparent"
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* ── منطقة أ: البيان الختامي ── */}
        <div className="reveal grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 pb-14 md:pb-16">
          {/* وحدة التحويل: عنوان + وصف + زر، مجمّعة ومتتابعة */}
          <div className="lg:col-span-7">
            <span className="text-primary font-cairo font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase block mb-5">
              Contact
            </span>

            <h2 className="text-4xl md:text-5xl font-black font-cairo text-foreground tracking-tight leading-tight">
              {/* المسافة بين السطرين مقصودة: بلا فاصل يُحسب الاسم المتاح للعنوان
                  «عندك فكرة تستحقتتحول لمشروع؟» ملتصقًا في بعض قارئات الشاشة. */}
              <span className="block">عندك فكرة تستحق</span>{" "}
              <span className="block text-transparent bg-clip-text bg-linear-to-l from-primary to-accent">
                تتحول لمشروع؟
              </span>
            </h2>

            <p className="mt-5 text-sm md:text-base text-foreground-dim font-cairo leading-relaxed max-w-md">
              تواصل معي وخلينا نحدد أفضل طريقة لتحويل فكرتك إلى تجربة ويب واضحة وقابلة للتطوير.
            </p>

            <SmoothScrollLink
              targetId="contact"
              className="group mt-8 inline-flex items-center gap-3 min-h-12 px-8 py-4 rounded-full bg-primary-strong text-white font-cairo font-black text-base transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              ابدأ مشروعك
              <ArrowUpLeft
                aria-hidden="true"
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </SmoothScrollLink>
          </div>

          {/* التواصل المباشر — نص تحريري، بلا كارت ولا مربّعات أيقونات */}
          <div className="lg:col-span-4 lg:col-start-9">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground-dim font-cairo mb-5">
              تواصل مباشرة
            </h2>

            <p className="text-[11px] font-cairo font-bold text-foreground-dim">
              البريد الإلكتروني
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              dir="ltr"
              className="mt-1 inline-block text-sm md:text-base font-bold text-foreground wrap-break-word text-right transition-colors md:hover:text-primary"
            >
              {CONTACT_EMAIL}
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="واتساب (يفتح في تبويب جديد)"
              className="group mt-5 flex items-center gap-1.5 min-h-11 w-fit text-sm md:text-base font-cairo font-bold text-foreground transition-colors md:hover:text-primary"
            >
              واتساب
              <ArrowUpLeft
                aria-hidden="true"
                size={14}
                className="shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </a>
          </div>
        </div>

        {/* ── منطقة ب: خدمية مضغوطة، بعد فاصل واحد ── */}
        <div className="border-t border-border pt-10 pb-10 flex flex-wrap gap-x-16 gap-y-10">
          {/* الهوية — عنقود صغير، الشعار غير مهيمن */}
          <div className="flex items-center gap-3">
            {/* الشعار مصغّر ومسحوب بخاصية منطقية (-me) لا بـ-ml، فيصح في الاتجاهين */}
            <div className="scale-[0.6] origin-right -me-4">
              <Logo />
            </div>
            <div>
              <p className="text-sm font-black font-cairo text-foreground">محمد جمال</p>
              <p className="text-xs font-cairo text-foreground-dim mt-0.5">مطوّر ويب</p>
            </div>
          </div>

          {/* التنقّل — شبكة 2×3 مضغوطة بدل عمود طويل */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground-dim font-cairo mb-3">
              روابط سريعة
            </h2>
            <nav aria-label="روابط سريعة" className="grid grid-cols-2 gap-x-8 gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`#${link.href}`}
                  className="text-sm font-cairo font-bold text-foreground-dim transition-colors md:hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* الروابط الخارجية — نص مضغوط */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground-dim font-cairo mb-3">
              تابعني
            </h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.name} (يفتح في تبويب جديد)`}
                    className="group inline-flex items-center gap-1 text-sm font-bold text-foreground-dim transition-colors md:hover:text-foreground"
                  >
                    {link.name}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={13}
                      className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── منطقة ج: الشريط السفلي ── */}
        <div className="border-t border-border pt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-5">
          <p className="text-foreground-dim text-[11px] font-cairo uppercase tracking-[0.2em] text-center sm:text-right">
            © 2026 محمد جمال — جميع الحقوق محفوظة
          </p>

          <SmoothScrollLink
            targetId="home"
            className="group inline-flex items-center gap-2 min-h-11 text-[11px] font-black uppercase tracking-[0.2em] font-cairo text-foreground-dim transition-colors md:hover:text-foreground"
          >
            العودة للأعلى
            <ArrowUpLeft
              aria-hidden="true"
              className="rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5"
              size={14}
            />
          </SmoothScrollLink>
        </div>
      </div>
    </footer>
  );
}
