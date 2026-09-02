import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";
import { publishableCaseStudies } from "@/lib/case-study";

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
    // دراسات الحالة القابلة للنشر وحدها. اليوم لا شيء منها معتمد، فالخريطة
    // تبقى عنوانًا واحدًا — لا نعلن مسارات تعيد 404.
    ...publishableCaseStudies().map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
    })),
  ];
}
