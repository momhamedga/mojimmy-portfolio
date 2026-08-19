import { FAQ_DATA } from "@/constants/faq-data";
import {
  CONTACT_EMAIL,
  JOB_TITLE,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
  SITE_NAME_EN,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/constants/site";

/**
 * بيانات منظّمة (JSON-LD) — Server Component، صفر JavaScript على العميل.
 *
 * ثلاثة أنواع فقط، وكلها صادقة وقابلة للتحقق من الصفحة نفسها:
 *   Person   — الكيان الأساسي: فرد لا شركة ولا استوديو
 *   WebSite  — بلا SearchAction لأن الموقع بلا بحث داخلي
 *   FAQPage  — مولَّد من FAQ_DATA نفسه الذي يرسم الأسئلة المرئية
 *
 * ممنوع نهائيًا: Review و AggregateRating — لا توجد مراجعات حقيقية،
 * وإضافتها ستكون تضليلًا لمحركات البحث ومخالفة لسياساتها.
 *
 * أمان: المحتوى ثابت من ملفات المشروع، ولا يدخله أي إدخال مستخدم.
 * التسلسل عبر JSON.stringify مع تهريب "<" فلا يمكن كسر وسم script.
 */

function jsonLd(data: unknown) {
  // تهريب المحارف التي قد تُنهي وسم <script> مبكرًا
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
    email: `mailto:${CONTACT_EMAIL}`,
    jobTitle: JOB_TITLE,
    description: SITE_DESCRIPTION,
    knowsLanguage: ["ar", "en"],
    sameAs: [...SOCIAL_PROFILES],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANG,
    publisher: { "@id": `${SITE_URL}/#person` },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPage) }} />
    </>
  );
}
