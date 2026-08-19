/**
 * ثوابت هوية الموقع — مصدر حقيقة واحد.
 * أي مكان يعرض البريد أو يرسل إليه لازم يقرأ من هنا، عشان ما يحصلش drift تاني.
 */

/** البريد المعتمد للتواصل. البريد القديم hello@mojimmy.com لا يعمل وممنوع استخدامه كـ fallback. */
export const CONTACT_EMAIL = "midoga400@gmail.com";

/**
 * المرسِل المعتمد — لازم يكون على دومين موثّق في Resend، وإلا يُرفض الإرسال.
 * لا يُستخدم بريد العميل كمرسِل إطلاقًا؛ بريده يذهب في replyTo فقط.
 */
export const CONTACT_FROM = "Mohamed Gamal Website <contact@mohamedjimmy.com>";

/**
 * اسم حقل الفخ في نموذج التواصل — مصدر حقيقة واحد يشاركه النموذج والخادم.
 *
 * غير دلالي عمدًا: الاسم السابق "company" تستهدفه خوارزميات الملء التلقائي
 * ومديرو كلمات المرور، فكان يُملأ لمستخدم حقيقي وتُبتلع رسالته بصمت.
 *
 * موضعه هنا لا في lib/contact-security لأن هذا الملف بلا أي اعتماد خادمي،
 * فاستيراده من مكوّن عميل لا يجرّ node:crypto ولا محدّد المعدّل إلى الحزمة.
 */
export const HONEYPOT_FIELD = "contact_ref";

/* ------------------------------------------------------------------ */
/* هوية الموقع لأغراض SEO                                              */
/* ------------------------------------------------------------------ */

/**
 * النطاق الأساسي المعتمد.
 *
 * تم التحقق فعليًا: mohamedjimmy.com يحوّل 301 إلى www.mohamedjimmy.com،
 * فالنسخة الوحيدة الصالحة للفهرسة هي www. لا حاجة لأي redirect في الكود —
 * الاستضافة تتكفّل به. النطاق القديم mojimmy.com غير مستخدم إطلاقًا.
 */
export const SITE_URL = "https://www.mohamedjimmy.com";

/** الاسم كما يظهر للزائر ومحركات البحث. */
export const SITE_NAME = "محمد جمال";
export const SITE_NAME_EN = "Mohamed Gamal";

/** المسمّى المهني — فرد لا شركة ولا استوديو. */
export const JOB_TITLE = "مطوّر ويب";
export const JOB_TITLE_EN = "Web Developer";

export const SITE_TITLE = `${SITE_NAME} | ${JOB_TITLE}`;

export const SITE_DESCRIPTION =
  "محمد جمال، مطوّر ويب يبني المواقع والتطبيقات والأنظمة بـReact وNext.js، من الواجهة إلى الـBackend، مع اهتمام بالأداء وسهولة الوصول وتحسين محركات البحث التقني.";

/** لغة المستند الفعلية — الواجهة عربية بالكامل. */
export const SITE_LOCALE = "ar_AE";
export const SITE_LANG = "ar";

/**
 * حسابات حقيقية موجودة أصلًا في الفوتر والقائمة — لا شيء مخترع.
 * تُستخدم في sameAs داخل Person schema.
 */
export const SOCIAL_PROFILES = [
  "https://github.com/momhamedga",
  "https://www.facebook.com/midoga20/",
  "https://www.instagram.com/jimmy_mo98/",
] as const;
