import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";

/**
 * الموقع صفحة واحدة: الجذر هو العنوان الوحيد القابل للفهرسة.
 * لا نخترع مسارات وهمية، ولا نضع changeFrequency أو priority تجميليين —
 * محركات البحث تتجاهلهما غالبًا، وقيمتهما هنا صفر.
 *
 * ولا lastModified: كان يُحسب وقت البناء، فيعلن أن الصفحة تغيّرت مع كل نشر
 * ولو لم يتغيّر فيها حرف. تاريخ تحديث غير صادق أسوأ من غيابه — محركات البحث
 * تُسقط ثقتها به، والغياب موقف صحيح ما دام لا مصدر حقيقي لتاريخ التغيير.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL, // نفس تمثيل canonical بالضبط — بلا شرطة مائلة زائدة
    },
  ];
}
