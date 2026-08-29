"use server";

import { headers } from "next/headers";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { CONTACT_EMAIL, CONTACT_FROM } from "@/constants/site";
import { ContactNotificationEmail } from "@/emails/ContactNotificationEmail";
import {
  ContactSchema,
  createIdempotencyKey,
  fingerprintSubmission,
  isDuplicateSubmission,
  isHoneypotTripped,
  isRateLimited,
  normalizeContactInput,
  sanitizeHeaderValue,
  type ContactFieldErrors,
} from "@/lib/contact-security";

/** مهلة انتظار مزوّد البريد قبل إرجاع خطأ عام للمستخدم. */
const PROVIDER_TIMEOUT_MS = 9000;

/**
 * عقد النتيجة — الوحيد الذي يراه العميل.
 * لا يحتوي أي شيء من المزوّد: لا رسالة خطأ ولا رمز حالة ولا payload.
 */
export type ContactActionResult =
  | { status: "success" }
  | { status: "validation_error"; fieldErrors: ContactFieldErrors }
  | { status: "rate_limited" }
  | { status: "error" };

/**
 * إرسال نموذج التواصل — Server Action.
 *
 * Phase 6: استُبدل Web3Forms بـResend + React Email. المزوّد السابق كان يُرفض
 * من طبقة Cloudflare أمام واجهته عند الاستدعاء من الخادم (403 challenge)،
 * فلم يكن مسار Server Action صالحًا معه أصلًا.
 *
 * ترتيب الطبقات مقصود — الأرخص أولًا، ولا نصل للمزوّد إلا بعد اجتيازها كلها:
 *   1. حقل الفخ        (لا يكشف نفسه للبوت)
 *   2. حدّ المعدّل      (أفضل جهد داخل النسخة)
 *   3. تطبيع + Zod      (مصدر الحقيقة الأمني، لا نثق بالمتصفح)
 *   4. منع التكرار      (نقر مزدوج / إعادة إرسال فورية)
 *   5. تعقيم الترويسة   (منع Header Injection في Subject)
 *   6. الإرسال بمهلة    (+ مفتاح Idempotency)
 *
 * الحماية من الطلبات عبر المواقع تعتمد على فحص Origin/Host المدمج في
 * Server Actions لدى Next.js — لم نُضِف طبقة مخصّصة حتى لا نكرّرها ولا نكسر
 * نشرات المعاينة على Vercel بمضيفين مثبّتين يدويًا.
 */
export async function submitContactForm(formData: FormData): Promise<ContactActionResult> {
  // 1. حقل الفخ — نرجع نجاحًا ظاهريًا حتى لا يتعلّم البوت أنه انكشف
  if (isHoneypotTripped(formData)) {
    console.warn("[contact] rejected: honeypot");
    return { status: "success" };
  }

  // 2. حدّ المعدّل
  const clientKey = await resolveClientKey();
  if (isRateLimited(clientKey)) {
    console.warn("[contact] rejected: rate limited");
    return { status: "rate_limited" };
  }

  // 3. التطبيع ثم التحقق — لا نثق بتحقق المتصفح إطلاقًا
  const normalized = normalizeContactInput(formData);
  const parsed = ContactSchema.safeParse(normalized);
  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "name" || key === "email" || key === "message") && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    console.warn("[contact] rejected: validation");
    return { status: "validation_error", fieldErrors };
  }

  const input = parsed.data;

  // 4. منع التكرار خلال نافذة قصيرة — نجاح ظاهري، فالرسالة الأولى وصلت فعلًا
  if (isDuplicateSubmission(fingerprintSubmission(input))) {
    console.warn("[contact] skipped: duplicate within window");
    return { status: "success" };
  }

  // 5. تعقيم أي قيمة تدخل ترويسة
  const subject = sanitizeHeaderValue(`طلب مشروع جديد — ${input.name}`);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // لا نكشف اسم المتغيّر ولا أي تفصيل إعداد للمستخدم
    console.error("[contact] configuration missing: mail provider key");
    return { status: "error" };
  }

  // 6. الإرسال
  try {
    const resend = new Resend(apiKey);
    const receivedAt = new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Dubai",
    }).format(new Date());

    // نُصيّر القالب إلى HTML هنا بدل تمرير react: إلى الـSDK.
    // السبب: Resend v6 يستورد @react-email/render ديناميكيًا وقت التشغيل،
    // وهذا الاستيراد لا يُحَل داخل حزمة الخادم المبنية فيفشل التصيير.
    // التصيير المسبق يزيل الاعتماد الديناميكي ويجعل الناتج حتميًا.
    const html = await render(ContactNotificationEmail({ ...input, receivedAt }));

    const send = resend.emails.send(
      {
        from: CONTACT_FROM,
        to: CONTACT_EMAIL,
        replyTo: input.email,
        subject,
        html,
        text: buildTextFallback({ ...input, receivedAt }),
      },
      { idempotencyKey: createIdempotencyKey() },
    );

    const result = await withTimeout(send, PROVIDER_TIMEOUT_MS);

    if (result === TIMED_OUT) {
      console.error("[contact] provider timeout");
      return { status: "error" };
    }

    if (result.error) {
      // نسجّل الاسم/النوع فقط — لا payload ولا رسالة المزوّد الكاملة
      console.error("[contact] provider rejected:", result.error.name);
      return { status: "error" };
    }

    // console.info محظور في إعداد ESLint هنا — warn هو أدنى مستوى مسموح
    console.warn("[contact] delivered: provider accepted");
    return { status: "success" };
  } catch (error) {
    console.error("[contact] unexpected failure:", error instanceof Error ? error.name : "unknown");
    return { status: "error" };
  }
}

/* ------------------------------------------------------------------ */

const TIMED_OUT = Symbol("timed-out");

/**
 * يحدّ زمن انتظارنا للمزوّد.
 *
 * قيد معلن: Resend SDK (v6) لا يعرض خيار timeout ولا AbortSignal — خيارات
 * المُنشئ هي baseUrl و userAgent فقط. لذلك هذا السباق يحدّ انتظارنا نحن
 * ولا يُلغي الطلب الصاعد. لم نلجأ لأي تعديل غير موثّق داخل الـSDK.
 */
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | typeof TIMED_OUT> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<typeof TIMED_OUT>((resolve) => {
        timer = setTimeout(() => resolve(TIMED_OUT), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * مفتاح تعريف العميل لحدّ المعدّل.
 *
 * توثيق Vercel (Phase 3A) ينصّ صراحةً على أنه يعيد كتابة x-forwarded-for
 * ولا يمرّر عناوين خارجية، «لمنع انتحال الـIP». فالمفتاح غير قابل للتزوير
 * في الإنتاج، وما رُصد من تزوير في Phase 3 كان محليًا بلا حافة Vercel أمامه.
 *
 * x-vercel-forwarded-for موثّقة بأنها مطابقة لـx-forwarded-for لكنها تصمد
 * لو وُضع وكيل فوق Vercel، فتُقرأ أولًا ثم يُرجع للأخرى. لم نُضِف
 * cf-connecting-ip ولا x-real-ip: المشروع ليس خلف Cloudflare، وإضافة
 * ترويسات يقبلها الخادم بلا حاجة توسّع سطح الثقة بلا مقابل.
 *
 * نأخذ أول مقطع فقط تحسّبًا لأي سلسلة، ولا نخزّن العنوان ولا نسجّله.
 * محليًا لا توجد ترويسة موثوقة فنستخدم مفتاحًا ثابتًا.
 */
async function resolveClientKey(): Promise<string> {
  try {
    const headerList = await headers();
    for (const name of ["x-vercel-forwarded-for", "x-forwarded-for"]) {
      const first = headerList.get(name)?.split(",")[0]?.trim();
      if (first) return first;
    }
    return "local";
  } catch {
    return "local";
  }
}

function buildTextFallback(input: {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}): string {
  return [
    "طلب مشروع جديد",
    "",
    `الاسم: ${input.name}`,
    `البريد الإلكتروني: ${input.email}`,
    "",
    "تفاصيل المشروع:",
    input.message,
    "",
    `وصلت في ${input.receivedAt} — من نموذج التواصل في mohamedjimmy.com`,
  ].join("\n");
}
