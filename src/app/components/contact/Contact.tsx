import { Mail, MessageCircle } from "lucide-react";
import { CONTACT_EMAIL } from "@/constants/site";
import ContactForm from "./ContactForm";

/** نفس الرابط المستخدم في زر واتساب العائم — لم يُنشأ رقم جديد. */
const WHATSAPP_URL = "https://wa.me/+971589915968";

/**
 * Server Component — قشرة قسم التواصل وكل نصوصه.
 *
 * النصوص تُمرَّر كـchildren إلى ContactForm (Client)، وهو نمط RSC الرسمي:
 * الـchildren تُرسم على السيرفر وتُمرَّر كـnodes جاهزة فلا تتحوّل لعميل.
 * النتيجة: كل نص القسم في HTML السيرفر، والـJavaScript للفورم وحده.
 *
 * 5B.9:
 * - min-h-screen أُزيل: القسم كان يُجبَر على ملء الشاشة مهما كان محتواه.
 * - «فلنصنع أثراً رقمياً» و«أصنع تجارب رقمية تترك بصمة لا تُمحى» استُبدلا بنص
 *   مباشر يشرح المطلوب من الزائر بدل المبالغة.
 * - شارة «متاح الآن للمشاريع المتميزة» أُزيلت: ادّعاء توفّر وجودة بلا سند.
 * - opacity-80 على نص الوصف أُزيل — كان يُسقط التباين إلى 4.34 في الوضع
 *   الفاتح (دون 4.5 المطلوبة). النص الآن على foreground-dim كاملًا.
 * - واتساب أُضيف كقناة موجودة أصلًا في الموقع، بنفس الرابط، بلا ادّعاء توفّر.
 *
 * منطق الإرسال/الأمان (Zod, rate limit, Resend) مؤجّل لـPhase 6 ولم يُمس.
 */
export default function Contact() {
  return (
    <section id="contact" dir="rtl" className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-primary/5 blur-[140px] rounded-full -z-10 pointer-events-none"
      />

      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <ContactForm>
            {/* عمود النصوص والتواصل المباشر — مرسوم على السيرفر بالكامل */}
            <div className="lg:col-span-5">
              <span className="text-primary font-cairo font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase block mb-5">
                Contact
              </span>

              <h2
                id="contact-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground font-cairo leading-tight tracking-tight"
              >
                جاهز نبدأ{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-l from-primary to-accent">
                  مشروعك؟
                </span>
              </h2>

              <p className="mt-5 text-sm md:text-base text-foreground-dim font-cairo leading-relaxed">
                عندك فكرة أو مشروع قائم؟ ابعث التفاصيل بشكل مختصر وأنا أراجعها.
              </p>

              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-xs font-cairo font-black uppercase tracking-[0.25em] text-foreground-dim mb-5">
                  تواصل مباشرة
                </h3>

                <ul className="flex flex-col gap-3">
                  <li>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="group flex items-center gap-3 min-h-11 rounded-xl -mx-2 px-2 transition-colors duration-300 hover:bg-foreground/5"
                    >
                      <Mail
                        aria-hidden="true"
                        size={16}
                        className="shrink-0 text-foreground-subtle transition-colors duration-300 group-hover:text-primary"
                      />
                      <span className="min-w-0">
                        <span className="block text-[11px] font-cairo font-bold text-foreground-dim">
                          البريد الإلكتروني
                        </span>
                        <span
                          dir="ltr"
                          className="block text-sm md:text-base font-bold text-foreground break-words text-right"
                        >
                          {CONTACT_EMAIL}
                        </span>
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="تواصل عبر واتساب (يفتح في تبويب جديد)"
                      className="group flex items-center gap-3 min-h-11 rounded-xl -mx-2 px-2 transition-colors duration-300 hover:bg-foreground/5"
                    >
                      <MessageCircle
                        aria-hidden="true"
                        size={16}
                        className="shrink-0 text-foreground-subtle transition-colors duration-300 group-hover:text-primary"
                      />
                      <span className="min-w-0">
                        <span className="block text-[11px] font-cairo font-bold text-foreground-dim">
                          واتساب
                        </span>
                        <span className="block text-sm md:text-base font-bold font-cairo text-foreground">
                          تواصل عبر واتساب
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </ContactForm>
        </div>
      </div>
    </section>
  );
}
