import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { HONEYPOT_FIELD } from "@/constants/site";

/**
 * طبقات حماية نموذج التواصل — خادمية بالكامل.
 *
 * لا CAPTCHA (قرار مالك المشروع)، فالحماية تعتمد على:
 * تطبيع + تحقق صارم + حقل فخ + حدّ معدّل + منع التكرار + تعقيم الترويسات.
 */

/** حدود الحقول — لا نقبل payload غير محدود. */
export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254, // أقصى طول لعنوان بريد في RFC 5321
  messageMin: 10,
  messageMax: 4000,
} as const;

/**
 * تحقق البريد بنمط عملي متحفّظ. لا نستخدم z.email() تفاديًا لاختلاف الـAPI
 * بين إصدارات Zod، والنمط مقصود أن يكون صارمًا لا شاملًا لكل RFC.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const ContactSchema = z.object({
  name: z.string().min(LIMITS.nameMin, "الاسم قصير جداً").max(LIMITS.nameMax, "الاسم طويل جداً"),
  email: z
    .string()
    .max(LIMITS.emailMax, "البريد الإلكتروني طويل جداً")
    .regex(EMAIL_PATTERN, "البريد الإلكتروني غير دقيق"),
  message: z
    .string()
    .min(LIMITS.messageMin, "التفاصيل قصيرة جداً، أخبرني بالمزيد")
    .max(LIMITS.messageMax, "التفاصيل طويلة جداً"),
});

export type ContactInput = z.infer<typeof ContactSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

/**
 * التطبيع يسبق التحقق: قصّ المسافات وتوحيد نهايات السطور وتصغير حروف البريد.
 * لا نعدّل نص الرسالة أكثر من ذلك — المحتوى ملك المرسل.
 */
export function normalizeContactInput(formData: FormData): ContactInput {
  const read = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };

  return {
    name: read("name").trim().replace(/\s+/g, " "),
    email: read("email").trim().toLowerCase(),
    message: read("message").replace(/\r\n?/g, "\n").trim(),
  };
}

/**
 * حقل الفخ: مخفي عن البشر، فأي قيمة فيه تعني إرسالًا آليًا.
 *
 * الاسم غير دلالي عمدًا. كان "company" وهو اسم تستهدفه خوارزميات الملء
 * التلقائي في المتصفحات ومديري كلمات المرور، فكان يُملأ لمستخدم حقيقي
 * فتُبتلع رسالته بصمت. autoComplete="off" إرشادي فقط ولا يمنع ذلك.
 */
export function isHoneypotTripped(formData: FormData): boolean {
  const v = formData.get(HONEYPOT_FIELD);
  return typeof v === "string" && v.trim().length > 0;
}

/** محارف التحكّم C0 و DEL — تُبنى برمجيًا فلا تدخل بايتات خام في الملف. */
const CONTROL_CHARS = new RegExp(
  `[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}]`,
  "g",
);

/**
 * تعقيم أي قيمة تدخل ترويسة بريد (Subject خصوصًا).
 * إزالة CR/LF وبقية محارف التحكّم تمنع Header Injection.
 * علامات الترقيم المطبوعة تبقى كما هي.
 */
export function sanitizeHeaderValue(value: string, maxLength = 120): string {
  return value
    .replace(/[\r\n]+/g, " ")
    .replace(CONTROL_CHARS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/* ------------------------------------------------------------------ */
/* حدّ المعدّل ومنع التكرار — أفضل جهد داخل نسخة واحدة فقط             */
/* ------------------------------------------------------------------ */

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_IN_WINDOW = 3;
const DUPLICATE_WINDOW_MS = 90_000;
const SWEEP_AFTER_MS = 10 * 60_000;

/**
 * تخزين داخل الذاكرة عمدًا: لا Redis ولا مخزن خارجي معتمد في هذا المشروع.
 *
 * قيد صريح: على Serverless لكل نسخة ذاكرتها، فالحدّ **ليس موزّعًا** ولا يصمد
 * أمام مهاجم يوزّع الطلبات. يكفي لمنع النقر المتكرر والموجات البسيطة، ويجب
 * استبداله بمخزن دائم (Upstash / Vercel KV) إذا كبر الترافيك.
 */
const rateHits = new Map<string, number[]>();
const recentFingerprints = new Map<string, number>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < SWEEP_AFTER_MS) return;
  lastSweep = now;
  for (const [key, stamps] of rateHits) {
    const fresh = stamps.filter((t) => now - t < RATE_WINDOW_MS);
    if (fresh.length) rateHits.set(key, fresh);
    else rateHits.delete(key);
  }
  for (const [key, t] of recentFingerprints) {
    if (now - t >= DUPLICATE_WINDOW_MS) recentFingerprints.delete(key);
  }
}

/** true إذا تجاوز هذا العميل الحدّ داخل النافذة. */
export function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  sweep(now);

  const stamps = (rateHits.get(clientKey) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (stamps.length >= RATE_MAX_IN_WINDOW) {
    rateHits.set(clientKey, stamps);
    return true;
  }

  stamps.push(now);
  rateHits.set(clientKey, stamps);
  return false;
}

/**
 * بصمة الرسالة — تُشتق من البريد والنص بعد التطبيع.
 * نخزّن الهاش وحده، فلا يبقى نص الرسالة في الذاكرة.
 */
export function fingerprintSubmission(input: ContactInput): string {
  return createHash("sha256").update(`${input.email}\n${input.message}`).digest("hex").slice(0, 32);
}

/** true إذا وصلت نفس البصمة خلال نافذة قصيرة (نقر مزدوج أو إعادة إرسال فورية). */
export function isDuplicateSubmission(fingerprint: string): boolean {
  const now = Date.now();
  sweep(now);

  const seen = recentFingerprints.get(fingerprint);
  if (seen !== undefined && now - seen < DUPLICATE_WINDOW_MS) return true;

  recentFingerprints.set(fingerprint, now);
  return false;
}

/**
 * مفتاح Idempotency لكل طلب مقبول — عشوائي، غير مشتق من المحتوى.
 *
 * مقصود: Resend يحتفظ بالمفتاح 24 ساعة، فلو اشتققناه من نص الرسالة لمنعنا
 * العميل من إرسال نفس النص عمدًا طوال اليوم. منع النقر المزدوج يتكفّل به
 * فلتر التكرار أعلاه، وهذا المفتاح يحمي إعادة محاولة نفس الطلب المقبول فقط.
 */
export function createIdempotencyKey(): string {
  return `contact-${randomUUID()}`;
}

/** حدود ونوافذ معلنة للتقرير والاختبارات. */
export const SECURITY_WINDOWS = {
  rateWindowMs: RATE_WINDOW_MS,
  rateMaxInWindow: RATE_MAX_IN_WINDOW,
  duplicateWindowMs: DUPLICATE_WINDOW_MS,
} as const;
