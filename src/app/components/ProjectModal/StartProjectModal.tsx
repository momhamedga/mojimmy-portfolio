"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, CheckCircle2, Rocket, Loader2, Sparkles } from "lucide-react";
import { StepOption } from "./StepOption";
import { submitContactForm } from "@/actions/contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_STEPS = 3;

const SERVICES = ["تصميم موقع فريد", "متجر إلكتروني متكامل", "تطوير تطبيق ويب", "هوية بصرية كاملة"];
const BUDGETS = ["2,000 - 5,000 AED", "5,000 - 10,000 AED", "10,000+ AED", "تحديد لاحقاً"];

interface ProjectRequest {
  service: string;
  budget: string;
  email: string;
  message: string;
}

/** اهتزاز خفيف — يتخطّى نفسه لو الـAPI غير موجود أو المستخدم طالب تقليل الحركة */
function haptic(pattern: number | number[]) {
  if (typeof window === "undefined" || !("vibrate" in navigator)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  navigator.vibrate(pattern);
}

/**
 * مودال طلب المشروع — مبني على عنصر <dialog> الأصلي.
 *
 * ليه <dialog> بدل تنفيذ يدوي؟ لأنه بيقدّم من المتصفح مباشرةً:
 *   • حبس التركيز داخل الحوار (focus trap)
 *   • تعطيل الخلفية بالكامل للكيبورد وقارئ الشاشة (inert)
 *   • الإغلاق بـEscape (حدث cancel)
 *   • إرجاع التركيز للعنصر اللي فتح الحوار
 *   • ::backdrop
 * كل ده بصفر dependency وبصفر focus-trap يدوي قد يكون خاطئًا (§53 · §54).
 *
 * ملاحظة: منطق الإرسال/التحقق لم يُمس — ملك Phase 6.
 */
export default function StartProjectModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState<ProjectRequest>({
    service: "",
    budget: "",
    email: "",
    message: "",
  });

  // فتح الحوار كـmodal + تنظيف عند الخروج (المتصفح بيرجّع التركيز تلقائيًا)
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (!el.open) el.showModal();
    headingRef.current?.focus();
    return () => {
      if (el.open) el.close();
    };
  }, []);

  // Escape: المتصفح بيطلق cancel — نمنع الإغلاق الافتراضي ونمشي عبر onClose
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  // النقر على الخلفية فقط — النقر داخل المحتوى لا يغلق
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const goNext = useCallback(() => {
    haptic(10);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const goBack = useCallback(() => {
    haptic(5);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  // نقل التركيز لعنوان الخطوة الجديدة حتى يعرف مستخدم القارئ أين أصبح
  useEffect(() => {
    headingRef.current?.focus();
  }, [step, isSuccess]);

  const handleSubmit = async () => {
    if (!EMAIL_PATTERN.test(data.email)) {
      setSubmitError("البريد الإلكتروني غير صحيح");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("name", "طلب مشروع جديد");
      fd.set("email", data.email);
      fd.set("message", `الخدمة: ${data.service}\nالميزانية: ${data.budget}\n\n${data.message}`);
      // الـsubject لم يعد يُرسل من العميل: الخادم يولّده ويعقّمه (Phase 6)

      const result = await submitContactForm(fd);
      if (result.status === "success") {
        setIsSuccess(true);
        haptic([100, 50, 100]);
      } else {
        // نصوص ثابتة في العميل — الخادم لا يمرّر أي رسالة من المزوّد
        haptic(200);
        if (result.status === "validation_error") {
          setSubmitError(
            result.fieldErrors.email ??
              result.fieldErrors.message ??
              "بيانات غير صحيحة، راجع الحقول",
          );
        } else if (result.status === "rate_limited") {
          setSubmitError("محاولات كثيرة، حاول مرة أخرى بعد قليل.");
        } else {
          setSubmitError("تعذر إرسال الرسالة الآن. حاول مرة أخرى لاحقًا.");
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmitError("فشل الاتصال بالسيرفر، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitle = isSuccess
    ? "تم استلام طلبك"
    : step === 1
      ? "ما هي الرؤية؟"
      : step === 2
        ? "حجم الاستثمار"
        : "تأكيد الإطلاق";

  return (
    <dialog
      ref={dialogRef}
      dir="rtl"
      aria-labelledby="project-modal-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="project-dialog bg-transparent p-0 m-0 max-w-none max-h-none w-full h-full backdrop:bg-black/60 backdrop:backdrop-blur-2xl"
    >
      <div className="min-h-full flex items-end md:items-center justify-center p-0 md:p-6">
        <div className="relative bg-surface/95 border border-border w-full max-w-xl md:rounded-[3.5rem] rounded-t-[3rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
          {/* Progress */}
          <div
            className="absolute top-0 left-0 right-0 h-0.75 bg-foreground/5 overflow-hidden"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={step}
            aria-label="تقدّم الطلب"
          >
            <div
              className="h-full transition-[width] duration-500"
              style={{
                width: `${(step / TOTAL_STEPS) * 100}%`,
                backgroundColor: "var(--color-primary)",
                boxShadow: "0 0 20px var(--color-primary)",
              }}
            />
          </div>

          <div className="px-8 pt-14 pb-10">
            <div className="flex justify-between items-center mb-10">
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق نافذة طلب المشروع"
                className="w-12 h-12 flex items-center justify-center bg-foreground/5 rounded-2xl hover:bg-foreground/10 transition-all text-foreground-dim group"
              >
                <X
                  aria-hidden="true"
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-500"
                />
              </button>

              {step > 1 && !isSuccess && (
                <button
                  type="button"
                  onClick={goBack}
                  className="font-cairo text-[10px] font-black uppercase tracking-widest text-foreground-dim flex items-center gap-2 hover:text-foreground transition-colors bg-foreground/5 px-5 py-2.5 rounded-full border border-border min-h-11"
                >
                  <ChevronLeft aria-hidden="true" size={14} /> عودة
                </button>
              )}
            </div>

            {/* عنوان الحوار — يستقبل التركيز عند كل تغيير خطوة */}
            <h2
              id="project-modal-title"
              ref={headingRef}
              tabIndex={-1}
              className="text-4xl font-black text-foreground font-cairo leading-tight tracking-tighter text-right"
            >
              {stepTitle}
            </h2>

            {isSuccess ? (
              <div role="status" className="py-16 flex flex-col items-center text-center">
                <div className="relative mb-10" aria-hidden="true">
                  <div
                    className="absolute inset-0 blur-3xl rounded-full opacity-20"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                  <div
                    className="w-28 h-28 rounded-[3rem] flex items-center justify-center relative z-10 shadow-2xl rotate-12"
                    style={{ backgroundColor: "var(--color-primary-strong)" }}
                  >
                    <CheckCircle2 size={54} className="text-white -rotate-12" />
                  </div>
                </div>
                <p className="text-foreground-dim font-cairo text-lg max-w-xs leading-relaxed">
                  رسالتك وصلت. سأراجع التفاصيل وأرد عليك قريباً.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-10 px-8 py-3 rounded-full border border-border-strong text-foreground font-cairo font-bold min-h-11"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <div className="mt-3">
                {step === 1 && (
                  <StepGroup
                    hint="اختر نوع المشروع لنبدأ التخطيط المعماري"
                    groupLabel="نوع المشروع"
                    options={SERVICES}
                    selected={data.service}
                    onSelect={(opt) => {
                      setData({ ...data, service: opt });
                      setTimeout(goNext, 400);
                    }}
                  />
                )}

                {step === 2 && (
                  <StepGroup
                    hint="ساعدني في تقدير الموارد المطلوبة"
                    groupLabel="حجم الميزانية"
                    options={BUDGETS}
                    selected={data.budget}
                    onSelect={(opt) => {
                      setData({ ...data, budget: opt });
                      setTimeout(goNext, 400);
                    }}
                  />
                )}

                {step === 3 && (
                  <div className="space-y-8 text-right">
                    <p className="text-foreground-dim font-cairo mt-3 text-sm tracking-wide">
                      كيف يمكنني الوصول إليك؟
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="modal-email" className="sr-only">
                          بريدك الإلكتروني
                        </label>
                        <input
                          id="modal-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          aria-invalid={submitError ? true : undefined}
                          aria-describedby={submitError ? "modal-error" : undefined}
                          placeholder="البريد الإلكتروني"
                          className="w-full p-6 bg-foreground/[0.02] border border-border-strong rounded-3xl text-foreground focus:border-primary transition-all text-right font-cairo placeholder:text-foreground-subtle"
                          value={data.email}
                          onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-message" className="sr-only">
                          نبذة عن مشروعك
                        </label>
                        <textarea
                          id="modal-message"
                          name="message"
                          placeholder="أخبرني باختصار عن طموحك.."
                          className="w-full p-6 bg-foreground/[0.02] border border-border-strong rounded-3xl text-foreground focus:border-primary transition-all h-32 resize-none text-right font-cairo placeholder:text-foreground-subtle"
                          value={data.message}
                          onChange={(e) => setData({ ...data, message: e.target.value })}
                        />
                      </div>

                      {submitError && (
                        <p
                          id="modal-error"
                          role="alert"
                          className="text-red-600 dark:text-red-400 font-cairo font-bold text-sm text-center"
                        >
                          {submitError}
                        </p>
                      )}

                      <button
                        type="button"
                        disabled={isSubmitting || !EMAIL_PATTERN.test(data.email)}
                        aria-busy={isSubmitting}
                        onClick={handleSubmit}
                        className="w-full py-4 font-cairo font-black rounded-2xl flex items-center justify-center gap-2.5 transition-all text-base shadow-lg text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                        style={{ backgroundColor: "var(--color-primary-strong)" }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 aria-hidden="true" className="animate-spin" /> جارٍ الإرسال…
                          </>
                        ) : (
                          <>
                            <Rocket aria-hidden="true" size={20} /> إطلاق الطلب
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isSuccess && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="h-px w-full bg-linear-to-r from-transparent via-foreground/5 to-transparent" />
                <div className="flex items-center gap-2">
                  <Sparkles aria-hidden="true" size={10} className="text-primary" />
                  <span className="text-[8px] font-mono text-foreground-dim uppercase tracking-[0.4em]">
                    Mojimmy • Abu Dhabi 2026
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

function StepGroup({
  hint,
  groupLabel,
  options,
  selected,
  onSelect,
}: {
  hint: string;
  groupLabel: string;
  options: string[];
  selected: string;
  onSelect: (opt: string) => void;
}) {
  return (
    <div className="space-y-8 text-right">
      <p className="text-foreground-dim font-cairo mt-3 text-sm tracking-wide">{hint}</p>
      <div className="grid gap-3" role="group" aria-label={groupLabel}>
        {options.map((opt) => (
          <StepOption
            key={opt}
            label={opt}
            selected={selected === opt}
            onClick={() => onSelect(opt)}
          />
        ))}
      </div>
    </div>
  );
}
