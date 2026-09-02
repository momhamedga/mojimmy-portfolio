"use client";

import {
  useState,
  useTransition,
  useCallback,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { Send, CheckCircle2, User, Mail, MessageSquare } from "lucide-react";
import ContactInput from "./ContactInput";
import { submitContactForm } from "@/actions/contact";
import { HONEYPOT_FIELD } from "@/constants/site";

const FIELD_ORDER = ["name", "email", "message"] as const;

/**
 * جزيرة العميل الوحيدة في قسم التواصل.
 * `children` هو عمود النصوص المرسوم على السيرفر — يُمرَّر كـnode جاهز.
 *
 * إتاحة (Phase 4 — محفوظة كما هي):
 * - التركيز ينتقل لأول حقل به خطأ بعد محاولة إرسال فاشلة.
 * - رسالة النجاح داخل role="status" فتُعلَن لقارئ الشاشة بلا مقاطعة.
 * - خطأ الفورم العام داخل role="alert" لأنه يستدعي تدخّلًا فوريًا.
 * - زر الإرسال يأخذ aria-busy واسمًا واضحًا أثناء الإرسال.
 *
 * 5B.9:
 * - نص الزر «إطلاق المشروع» صار «إرسال الرسالة»: الزر يرسل رسالة لا يطلق مشروعًا.
 * - وعد الرد «خلال الـ24 ساعة القادمة» أُزيل من رسالة النجاح — لا سياسة رد
 *   مؤكَّدة، ولا يصح إطلاق وعد زمني نيابة عن صاحب الموقع.
 * - غلاف Magnetic أُزيل من الزر (تتبّع مؤشّر زخرفي بلا قيمة على زر إرسال).
 * - الكارت خُفّف: rounded-[3rem] و p-14 و backdrop-blur-3xl و shadow-2xl
 *   وهالة التوهّج استُبدلت بمادة الكروت المعتمدة في بقية الأقسام.
 *
 * منطق التحقق والإرسال لم يُمس (ملك Phase 6): نفس الحقول ونفس الـFormData
 * ونفس الـsubject المولَّد تلقائيًا الذي يقرأه الـserver action.
 */
export default function ContactForm({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * حارس «قيد الإرسال» متزامن.
   *
   * `isPending` القادم من useTransition لا يصير true إلا بعد أن يُثبّت React
   * التصيير، فثلاث نقرات داخل نفس الـtick تعبر جميعها الشرط. قياس Phase 3
   * أثبت ذلك: ثلاث نقرات متتالية أنتجت ثلاثة استدعاءات للـServer Action.
   * الرسائل المكرّرة كان يبتلعها فلتر التكرار في الخادم، لكن الطلبات الثلاثة
   * كانت تستهلك ميزانية حدّ المعدّل (٣ في الدقيقة) فتُحرم المستخدم من إعادة
   * محاولة مشروعة بعد لحظات.
   *
   * الـref يتغيّر فورًا وبشكل متزامن، فيحسم السباق قبل أي إعادة تصيير.
   * هذا تحسين تجربة فقط — الخادم يبقى المرجع: فلتر التكرار وحدّ المعدّل
   * وحقل الفخ كلها في مكانها ولم يُمسّ أيٌّ منها.
   */
  const inFlight = useRef(false);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window === "undefined" || !("vibrate" in navigator)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    navigator.vibrate(pattern);
  }, []);

  const focusFirstError = useCallback((fieldErrors: Record<string, string>) => {
    const first = FIELD_ORDER.find((f) => fieldErrors[f]);
    if (!first) return;
    formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
  }, []);

  /**
   * إعلان واحد مهذّب بعدد الحقول الراسبة.
   *
   * الأخطاء نفسها مرتبطة بحقولها عبر `aria-describedby`، ونقل التركيز إلى
   * أول حقل راسب يجعل قارئ الشاشة ينطق خطأه. لكن المستخدم كان لا يعرف أن
   * هناك خطأين آخرين إلا حين يبلغهما — فهذا السطر يعطيه الصورة كاملة من
   * أول لحظة (قياس 7A).
   *
   * `polite` لا `assertive`: التركيز ينتقل في اللحظة نفسها، وإعلان مقاطِع
   * فوقه يزاحم نطق الحقل. وثلاثة تنبيهات منفصلة كانت ستضاعف الضجيج بلا فائدة.
   */
  const [errorSummary, setErrorSummary] = useState("");

  const summarize = useCallback((count: number) => {
    if (count === 0) return "";
    if (count === 1) return "حقل واحد يحتاج إلى تصحيح";
    if (count === 2) return "حقلان يحتاجان إلى تصحيح";
    return `${count} حقول تحتاج إلى تصحيح`;
  }, []);

  /**
   * قواعد التحقق في العميل — مصدر واحد، بلا نسخة ثانية.
   *
   * القواعد نفسها التي كانت داخل دالة الـaction حرفيًا: لا قيد أُضيف ولا
   * قيد خُفّف. الخادم يبقى المرجع النهائي؛ هذا تحسين تجربة فقط.
   */
  const validate = useCallback((formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const newErrors: Record<string, string> = {};
    if (!name || name.length < 2) newErrors.name = "أخبرني ما اسمك الكريم؟";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "البريد الإلكتروني غير دقيق";
    if (!message || message.length < 10)
      newErrors.message = "مساحة الرسالة قصيرة جداً، أخبرني بالمزيد..";
    return newErrors;
  }, []);

  /**
   * حارس الإرسال — يسبق مسار `action` ويلغيه عند الخطأ.
   *
   * التحقق كان يجري **داخل** دالة الـaction ويكتفي بـ`return` عند الخطأ.
   * لكن React 19 يعيد تعيين النموذج غير المتحكَّم فيه بعد اكتمال دالة
   * الـaction مهما كانت نتيجتها، فالخروج المبكر لم يكن يمنع شيئًا: كانت
   * الحقول الثلاثة تُمسح وتضيع كتابة المستخدم عند كل محاولة فاشلة — وقياس
   * 5B.1 أثبتها (A / nope / قصير → ثلاثة حقول فارغة، بصفر طلبات).
   *
   * `preventDefault` في حدث الإرسال هو المخرج الذي يقرّه React: مع
   * `defaultPrevented` لا يعمل مسار الـaction أصلًا، فلا استدعاء ولا إعادة
   * تعيين. الحقول تبقى كما كتبها صاحبها، ويصحّح ما أخطأ فيه ويعيد المحاولة.
   *
   * الترتيب مقصود: التحقق هنا قبل حارس الـtick الواحد، لأن المحاولة الفاشلة
   * يجب ألّا تلمس حالة «قيد الإرسال» إطلاقًا.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const fieldErrors = validate(new FormData(event.currentTarget));
    const count = Object.keys(fieldErrors).length;

    // الإعلان يتحدّث عند كل محاولة إرسال لا عند كل ضغطة مفتاح: الكتابة
    // العادية لا تلمسه، فلا يتحوّل إلى ثرثرة مستمرّة في أذن المستخدم.
    setErrorSummary(summarize(count));
    if (count === 0) return;

    event.preventDefault();
    setErrors(fieldErrors);
    triggerHaptic(200);
    focusFirstError(fieldErrors);
  };

  const handleAction = async (formData: FormData) => {
    // نقرة ثانية داخل نفس الـtick تجد الحارس مرفوعًا فتنسحب بلا استدعاء
    if (inFlight.current) return;
    inFlight.current = true;

    setErrors({});

    startTransition(async () => {
      // finally لا try/catch: عقد الأخطاء لم يتغيّر، لكن الحارس يُخفض مهما
      // انتهى الاستدعاء — نجاحًا أو خطأ أو رفضًا غير متوقّع — فلا يعلق أبدًا
      try {
        const result = await submitContactForm(formData);

        if (result.status === "success") {
          setIsSuccess(true);
          triggerHaptic([50, 30, 50]);
          formRef.current?.reset();
          return;
        }

        triggerHaptic(200);

        // الرسائل هنا ثابتة في العميل — الخادم لا يمرّر أي نص من المزوّد
        if (result.status === "validation_error") {
          setErrors(result.fieldErrors);
          setErrorSummary(summarize(Object.keys(result.fieldErrors).length));
          focusFirstError(result.fieldErrors);
        } else if (result.status === "rate_limited") {
          setErrors({ form: "محاولات كثيرة، حاول مرة أخرى بعد قليل." });
        } else {
          setErrors({ form: "تعذر إرسال الرسالة الآن. حاول مرة أخرى لاحقًا." });
        }
      } finally {
        inFlight.current = false;
      }
    });
  };

  if (isSuccess) {
    return (
      <div role="status" className="max-w-xl mx-auto text-center py-12">
        <span
          aria-hidden="true"
          className="inline-flex w-16 h-16 rounded-full bg-foreground text-background items-center justify-center"
        >
          <CheckCircle2 size={32} strokeWidth={2.5} />
        </span>

        <h3 className="mt-6 text-2xl md:text-3xl font-black text-foreground font-cairo tracking-tight">
          تم الإرسال
        </h3>

        <p className="mt-3 text-sm md:text-base text-foreground-dim font-cairo leading-relaxed">
          وصلتني رسالتك، وسأطّلع عليها وأعود إليك.
        </p>

        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-8 min-h-11 px-6 py-3 rounded-full border border-border-strong text-foreground font-bold font-cairo text-sm transition-colors hover:bg-foreground hover:text-background"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      {children}

      <div className="reveal lg:col-span-7">
        <form
          ref={formRef}
          action={handleAction}
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="contact-heading"
          className="rounded-3xl border border-border bg-surface/60 backdrop-blur-md p-6 md:p-8 flex flex-col gap-5"
        >
          {/*
            حقل فخ للبوتات: مخفي بصرياً وغير قابل للوصول بلوحة المفاتيح.
            الاسم غير دلالي حتى لا يملأه الملء التلقائي لمستخدم حقيقي،
            و data-*-ignore تمنع مديري كلمات المرور من لمسه.
          */}
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            data-lpignore="true"
            data-1p-ignore=""
            className="absolute left-[-9999px] w-px h-px opacity-0"
          />

          {/*
            إعلان مهذّب واحد بعدد الحقول الراسبة — مرئي لقارئ الشاشة فقط.
            `sr-only` لا `display:none`: الإخفاء الكامل يُخرجه من شجرة
            الإتاحة فلا يُنطق أصلًا.
          */}
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {errorSummary}
          </p>

          {/* الاسم والبريد جنبًا إلى جنب على الشاشات المتوسطة فأعلى */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ContactInput
              icon={User}
              name="name"
              label="الاسم"
              placeholder="اسمك الكامل"
              autoComplete="name"
              required
              error={errors.name}
            />
            <ContactInput
              icon={Mail}
              name="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="name@example.com"
              autoComplete="email"
              dir="ltr"
              required
              error={errors.email}
            />
          </div>

          <ContactInput
            icon={MessageSquare}
            name="message"
            isTextArea
            label="تفاصيل المشروع"
            placeholder="احكي لي باختصار عن الفكرة أو المشروع..."
            required
            error={errors.message}
          />

          {errors.form && (
            <p role="alert" className="text-red-700 dark:text-red-400 font-cairo font-bold text-sm">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="group w-full min-h-12 px-6 py-3 bg-foreground text-background rounded-2xl font-black font-cairo text-sm md:text-base transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"
                />
                جارٍ الإرسال…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                إرسال الرسالة
                <Send
                  aria-hidden="true"
                  size={16}
                  className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
